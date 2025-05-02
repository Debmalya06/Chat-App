package com.substring.chat.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.substring.chat.Repository.RoomRepo;
import com.substring.chat.entities.Message;
import com.substring.chat.entities.Room;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {
    private RoomRepo roomRepo;
    public RoomController(RoomRepo roomRepo){
        this.roomRepo = roomRepo;
    }
    //create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId){
        if(roomRepo.findByRoomId(roomId) != null){
            return ResponseEntity.badRequest().body("Room is already created");
        }
        //create new room
        Room room = new Room();
        room.setRoomId(roomId); 
        Room savedRoom = roomRepo.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
        
    }
    //get room
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(
       @PathVariable String roomId
    ) {
        Room room = roomRepo.findByRoomId(roomId);
        if(room == null){
            return ResponseEntity.badRequest().body("room is not found!!!!");
        }
        return ResponseEntity.ok(room);
    }


    //get message of room
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessageOfRoom(
        @PathVariable String roomId,
        @RequestParam(value = "page", defaultValue = "0", required = false) int page,
        @RequestParam(value = "size", defaultValue = "20", required = false) int size
    ){
        Room room = roomRepo.findByRoomId(roomId);
        if(room == null){
            return ResponseEntity.badRequest().build();
        }
        List<Message> messages = room.getMessage();
        int  start = Math.max(0, messages.size() - (page +1)* size);
        int end = Math.min(messages.size(), start + size);
        return ResponseEntity.ok(messages);
    }

}
