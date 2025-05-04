<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProfessionalRejectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $reason;

    public function __construct(string $reason)
    {
        $this->reason = $reason;
    }

    public function via($notifiable)
    {
        return ['mail', 'database']; // Notification email + en base
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Votre demande de compte professionnel')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Votre demande de compte professionnel a été examinée.')
            ->line('**Statut :** Non approuvé')
            ->line('**Raison :** ' . $this->reason)
            ->line('Vous pouvez:')
            ->line('- Corriger les informations et re-soumettre')
            ->line('- Nous contacter pour plus de détails')
            ->action('Modifier mon profil', url('/profile/edit'))
            ->line('Merci de votre compréhension.')
            ->salutation('Cordialement, L\'équipe Naturopathie');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'professional_rejected',
            'message' => 'Votre demande professionnelle a été refusée: ' . $this->reason,
            'action_url' => '/profile/edit',
            'reason' => $this->reason
        ];
    }
}