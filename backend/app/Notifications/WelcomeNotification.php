<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\User;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public User $user,
        public string $role
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject('Bienvenue sur NaturalMedecine !')
            ->greeting("Bonjour {$this->user->name} !");

        $this->role === 'health_professional'
            ? $this->addProfessionalContent($mail)
            : $this->addUserContent($mail);

        return $mail->action('Commencer', url('/'))
            ->salutation('L\'équipe NaturalMedecine');
    }

    protected function addProfessionalContent(MailMessage $mail): void
    {
        $mail->line('Votre compte professionnel est en cours de vérification.')
            ->line('Vous recevrez une notification dès approbation.')
            ->lines([
                'Durant cette attente, vous pouvez:',
                '- Compléter votre profil',
                '- Explorer les recettes existantes'
            ]);
    }

    protected function addUserContent(MailMessage $mail): void
    {
        $mail->line('Votre compte utilisateur a été créé avec succès !')
            ->lines([
                'Commencez dès maintenant à:',
                '- Explorer les recettes naturelles',
                '- Poser des questions dans le forum'
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'welcome',
            'message' => $this->getWelcomeMessage(),
            'action_url' => '/'
        ];
    }

    protected function getWelcomeMessage(): string
    {
        return match($this->role) {
            'health_professional' => 'Votre compte professionnel est en attente de validation',
            default => 'Bienvenue sur la plateforme !'
        };
    }
}