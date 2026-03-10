package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    // ==========================
    // 1️⃣ Get all managers
    // ==========================
    @GetMapping("/managers")
    public List<User> getAllManagers() {
        return userRepository.findByRole("MANAGER");
    }

    // ==========================
    // 2️⃣ Get all employees
    // ==========================
    @GetMapping("/employees")
    public List<User> getAllEmployees() {
        return userRepository.findByRole("EMPLOYEE");
    }

    // ==========================
    // 3️⃣ Add new user (Manager or Employee)
    // ==========================
    @PostMapping("/add-user")
    public User addUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // ==========================
    // 4️⃣ Update existing user
    // ==========================
    @PutMapping("/update-user/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setPassword(updatedUser.getPassword());
        user.setRole(updatedUser.getRole());
        return userRepository.save(user);
    }

    // ==========================
    // 5️⃣ Delete user
    // ==========================
    @DeleteMapping("/delete-user/{id}")
    public String deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return "User not found";
        }
        userRepository.deleteById(id);
        return "User deleted successfully";
    }
}