<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ProfessionalVerifiedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Votre compte professionnel a été approuvé')
            ->line('Félicitations! Votre compte professionnel a été vérifié.')
            ->line('Vous pouvez maintenant publier des recettes et participer pleinement à la communauté.')
            ->action('Commencer', url('/dashboard'))
            ->line('Merci de faire partie de notre communauté!');
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'Votre compte professionnel a été vérifié',
            'link' => '/dashboard'
        ];
    }
}