package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import com.example.demo.model.Task;
import com.example.demo.repository.TaskRepository;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // ===============================
    // 1️⃣ Add task (Manager assigns task)
    // ===============================
    @PostMapping("/add")
    public Task addTask(@RequestBody Task task) {
        task.setStatus("Pending");
        if (task.getEmployeeEmail() != null) {
            task.setEmployeeEmail(task.getEmployeeEmail().toLowerCase());
        }
        return taskRepository.save(task);
    }

    // ===============================
    // 2️⃣ Get all tasks (Manager view)
    // ===============================
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // ===============================
    // 3️⃣ Get tasks by employee
    // ===============================
    @GetMapping("/employee/{email}")
    public List<Task> getTasksByEmployee(@PathVariable String email) {
        return taskRepository.findByEmployeeEmailIgnoreCase(email);
    }

    // ===============================
    // 4️⃣ Update task status
    // ===============================
    @PutMapping("/{id}/status")
    public Task updateStatus(@PathVariable Long id, @RequestBody Task updatedTask) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setStatus(updatedTask.getStatus());
        return taskRepository.save(task);
    }

    // ===============================
    // 5️⃣ Delete task
    // ===============================
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }

    // ===============================
    // 6️⃣ Update full task (Manager)
    // ===============================
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setEmployeeEmail(updatedTask.getEmployeeEmail());
        task.setDeadline(updatedTask.getDeadline());
        task.setStatus(updatedTask.getStatus());
        return taskRepository.save(task);
    }

    // ===============================
    // 7️⃣ Complete task with PDF upload (Employee)
    // ===============================
    @PostMapping("/{id}/complete")
    public Task completeTask(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        Task task = taskRepository.findById(id).orElseThrow();

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is missing");
        }

        // Allowed folder for uploads (absolute path)
        String folder = Paths.get(System.getProperty("user.dir"), "uploads").toString();
        File dir = new File(folder);
        if (!dir.exists()) {
            dir.mkdirs(); // create folder if not exists
        }

        // Unique file name
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(dir, fileName);

        try {
            file.transferTo(dest); // save the file
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }

        // Update task status
        task.setStatus("Completed");
        task.setCompletedFile(dest.getAbsolutePath());

        return taskRepository.save(task);
    }

    // ===============================
    // 8️⃣ Download / view completed file (Manager)
    // ===============================
    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> getCompletedFile(@PathVariable Long id) throws MalformedURLException {
        Task task = taskRepository.findById(id).orElseThrow();

        if (task.getCompletedFile() == null) {
            return ResponseEntity.notFound().build();
        }

        Path path = Paths.get(task.getCompletedFile());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + path.getFileName().toString() + "\"")
                .body(resource);
    }
}