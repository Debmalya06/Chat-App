package com.substring.chat.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private String sender;
    private String content;
    private LocalDateTime timestamp;
    public Message (String sender, String content){
        this.sender = sender;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    
    }

}
