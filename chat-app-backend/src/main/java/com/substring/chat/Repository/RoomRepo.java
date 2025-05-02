package com.substring.chat.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.substring.chat.entities.Room;
import java.util.List;


public interface RoomRepo extends MongoRepository<Room, String> {
    Room findByRoomId(String roomId);
}
