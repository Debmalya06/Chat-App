package com.substring.chat.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReqMessage {
    private String sender;
    private String content;
    private String roomId;
    private String timestamp; // Use String for timestamp to match the original code structure
}
