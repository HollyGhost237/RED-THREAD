<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use App\Models\User;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class NewProfessionalNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database', 'mail']; // Notification dans l'interface admin + email
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nouveau professionnel en attente')
            ->line('Un nouveau professionnel de santé s\'est inscrit:')
            ->line($this->user->name)
            ->line($this->user->professional_title)
            ->action('Vérifier le compte', url('/admin/professionals'))
            ->line('Merci d\'utiliser notre application!');
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'Nouveau professionnel en attente: ' . $this->user->name,
            'user_id' => $this->user->id,
            'link' => '/admin/professionals/'.$this->user->id
        ];
    }
}