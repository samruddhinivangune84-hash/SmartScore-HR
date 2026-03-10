package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Productivity;
import com.example.demo.model.Task;
import com.example.demo.repository.ProductivityRepository;

@Service
public class ProductivityService {

    @Autowired
    private ProductivityRepository productivityRepository;

    // ===== AI Productivity Score Calculation =====
    public int calculateScore(List<Task> tasks) {

        int total = tasks.size();
        int completed = 0;
        int overdue = 0;

        for (Task t : tasks) {

            if ("Completed".equalsIgnoreCase(t.getStatus())) {
                completed++;
            }

            if (t.getDeadline().isBefore(LocalDate.now())
                    && !"Completed".equalsIgnoreCase(t.getStatus())) {
                overdue++;
            }
        }

        if (total == 0)
            return 0;

        int score = (completed * 100 / total) - (overdue * 5);

        if (score < 0)
            score = 0;

        return score;
    }

    // ===== Save Productivity Data =====
    public Productivity saveProductivity(Productivity productivity) {
        return productivityRepository.save(productivity);
    }

    // ===== Get All Productivity Records =====
    public List<Productivity> getAllProductivity() {
        return productivityRepository.findAll();
    }
}