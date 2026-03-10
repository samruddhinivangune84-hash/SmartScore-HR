package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Productivity;
import com.example.demo.service.ProductivityService;

@RestController
@RequestMapping("/api/productivity")
@CrossOrigin
public class ProductivityController {

    @Autowired
    private ProductivityService productivityService;

    @PostMapping
    public Productivity addProductivity(@RequestBody Productivity productivity) {
        return productivityService.saveProductivity(productivity);
    }

    @GetMapping
    public List<Productivity> getProductivity() {
        return productivityService.getAllProductivity();
    }
}