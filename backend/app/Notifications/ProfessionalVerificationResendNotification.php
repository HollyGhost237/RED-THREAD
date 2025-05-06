<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProfessionalVerificationResendNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $professional;

    public function __construct(User $professional)
    {
        $this->professional = $professional;
    }

    public function via($notifiable)
    {
        return ['mail', 'database']; // Ajout du stockage en base
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('[URGENT] Nouvelle demande de vérification professionnelle')
            ->greeting('Bonjour Admin,')
            ->line('Une nouvelle demande de vérification a été initiée pour :')
            ->line('Nom : ' . $this->professional->name)
            ->line('Email : ' . $this->professional->email)
            ->line('Titre Professionnel : ' . $this->professional->professional_title)
            ->action('Vérifier maintenant', url('/admin/professionals/' . $this->professional->id))
            ->line('Merci de traiter cette demande sous 48 heures.')
            ->salutation('Cordialement,');
    }

    public function toArray($notifiable)
    {
        return [
            'professional_id' => $this->professional->id,
            'message' => 'Nouvelle demande de vérification pour ' . $this->professional->name,
            'action_url' => '/admin/professionals/' . $this->professional->id
        ];
    }
}