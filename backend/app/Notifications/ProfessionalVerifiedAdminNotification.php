<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ProfessionalVerifiedAdminNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public User $professional)
    {
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => "Le professionnel {$this->professional->name} a été vérifié",
            'user_id' => $this->professional->id,
            'url' => '/admin/professionals'
        ];
    }
}