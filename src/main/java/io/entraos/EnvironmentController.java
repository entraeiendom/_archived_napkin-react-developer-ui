package io.entraos;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

@RestController
public class EnvironmentController {

    private String html = "<h1>An error has occured </h1>";


    Logger logger = LoggerFactory.getLogger(MainApplication.class);

    @Autowired
    public EnvironmentController(Environment springEnv) throws IOException {
        String environment = springEnv.getProperty("environment");
        String oauthClientId = springEnv.getProperty("oauthClientId");
        String apiUrl = springEnv.getProperty("apiUrl");
        String observationApiUrl = springEnv.getProperty("observationApiUrl");
        String oauthDomain = springEnv.getProperty("oauthDomain");

        InputStream resource = new ClassPathResource(
                "public/index.html").getInputStream();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource))) {
            String html = reader.lines()
                    .collect(Collectors.joining("\n"));



            this.html = html.replace("<head>", "<head><script id=\"environment\">window.env = {" +
                    "APP_API_URL:\""+apiUrl+"\"," +
                    "OBSERVATION_API_URL:\""+observationApiUrl+"\"," +
                    "APP_ENVIRONMENT_NAME:\""+environment+"\"," +
                    "OAUTH_CLIENT_ID:\""+oauthClientId+"\"," +
                    "OAUTH_DOMAIN:\""+oauthDomain+"\"" +
                    "}</script>");
            logger.info(this.html);

        }
    }


    @GetMapping("/")
    @ResponseBody
    public String index() {
        return html;
    }

}

