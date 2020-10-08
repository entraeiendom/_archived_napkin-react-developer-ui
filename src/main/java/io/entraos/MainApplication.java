package io.entraos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class MainApplication extends SpringBootServletInitializer {

    public static final String APPLICATION_NAME = "napkin-developer-ui";

    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
        System.out.println("Napkin Developer UI - started on port 3000");
        System.out.println("Napkin Developer UI - health http://localhost:3000/health");
    }


}
