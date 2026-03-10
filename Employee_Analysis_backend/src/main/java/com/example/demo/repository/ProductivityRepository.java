package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Productivity;

public interface ProductivityRepository extends JpaRepository<Productivity, Long> {

}