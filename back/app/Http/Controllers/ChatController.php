<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\Events\Dispatcher;

use App\Http\Requests;
use App\Events\MessagePublished;
use App\Models\Message as MessageModel;
use App\Http\Controllers\Controller;

use Pusher;

class ChatController extends Controller
{
    private $messages;

    public function __construct(MessageModel $messages)
    {
        $this->messages = $messages;
    }

    /**
     * Display last 20 messages
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->messages->orderBy('id', 'desc')->take(20)->get()->reverse();
    }

    /**
     * Store a newly created message
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Dispatcher $event)
    {
        $message = $this->messages->create($request->input());
        $event->fire(new MessagePublished($message));

        return response($message, 201);
    }    

    public function auth(Request $request, Pusher $pusher)
    {
        return $pusher->presence_auth(
            $request->input('channel_name'),
            $request->input('socket_id'),
            uniqid(),
            ['username' => $request->input('username')]
        );
    }
}
