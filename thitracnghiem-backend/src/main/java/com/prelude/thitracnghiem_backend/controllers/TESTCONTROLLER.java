package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/TEST")
public class TESTCONTROLLER {

    @GetMapping("/authenticate")
    public ResponseApi helloWorld() {
        return new ResponseApi(HttpStatus.ACCEPTED, "AAA", null, true);
    }
}
