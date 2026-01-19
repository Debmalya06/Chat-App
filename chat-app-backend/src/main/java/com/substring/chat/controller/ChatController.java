package com.substring.chat.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import com.substring.chat.Repository.RoomRepo;
import com.substring.chat.entities.Message;
import com.substring.chat.entities.Room;
import com.substring.chat.payload.ReqMessage;

@Controller
@CrossOrigin(origins = {"http://localhost:5173", "https://chat-app-38ks.onrender.com"})
public class ChatController {
    
    private RoomRepo roomRepo;
    
    //for sendeing and reciveing messages
    public ChatController(RoomRepo roomRepo) {
        this.roomRepo = roomRepo;
    }

    @MessageMapping("/sendMessage/{roomId}")
     @SendTo("/topic/messages/{roomId}")
    public Message sendMessage(
        @DestinationVariable String roomId,
        @RequestBody ReqMessage request
    ){
        Room room = roomRepo.findByRoomId(roomId);
        Message message = new Message();
        message.setSender(request.getSender());
        message.setContent(request.getContent());
        message.setTimestamp(LocalDateTime.now());
        if(room != null){
            room.getMessage().add(message);
            roomRepo.save(room);
        } else {
            throw new RuntimeException("room not found!!");
        }
        return message;
    }

}
