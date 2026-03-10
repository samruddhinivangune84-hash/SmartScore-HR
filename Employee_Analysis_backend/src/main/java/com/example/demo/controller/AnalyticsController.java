package com.example.demo.controller;

import com.example.demo.model.Task;
import com.example.demo.repository.TaskRepository;
import com.example.demo.service.ProductivityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin
public class AnalyticsController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProductivityService productivityService;

    @GetMapping("/productivity/{email}")
    public int getProductivityScore(@PathVariable String email) {

        List<Task> tasks = taskRepository.findByEmployeeEmail(email);

        return productivityService.calculateScore(tasks);
    }
}