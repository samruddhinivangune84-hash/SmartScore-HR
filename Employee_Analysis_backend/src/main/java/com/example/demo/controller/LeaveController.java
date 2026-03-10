package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.LeaveRequest;
import com.example.demo.repository.LeaveRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:3000")
public class LeaveController {

    @Autowired
    private LeaveRepository leaveRepository;

    // Employee submits leave
    @PostMapping("/apply")
    public LeaveRequest applyLeave(@RequestBody LeaveRequest leave) {

        leave.setStatus("Pending");

        return leaveRepository.save(leave);
    }

    // Manager sees all leaves
    @GetMapping
    public List<LeaveRequest> getAllLeaves() {

        return leaveRepository.findAll();
    }

    // Employee sees own leaves
    @GetMapping("/employee/{email}")
    public List<LeaveRequest> getEmployeeLeaves(@PathVariable String email) {

        return leaveRepository.findByEmployeeEmail(email);
    }

    // Manager approves or denies
    @PutMapping("/{id}/status")
    public LeaveRequest updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        LeaveRequest leave = leaveRepository.findById(id).orElseThrow();

        leave.setStatus(body.get("status"));

        return leaveRepository.save(leave);
    }

}