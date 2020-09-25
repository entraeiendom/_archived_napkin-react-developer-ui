package io.entraos;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    public EnvironmentController() throws IOException {
        logger.info("Runrun");
        InputStream resource = new ClassPathResource(
                "public/index.html").getInputStream();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource))) {
            String html = reader.lines()
                    .collect(Collectors.joining("\n"));
            this.html = html.replace("<head>", "<head><script id=\"environment\">window.env = {" +
                    "APP_API_URL:\"https://api-devtest.entraos.io\"," +
                    "APP_ENVIRONMENT_NAME:\"devtest\"," +
                    "OAUTH_CLIENT_ID:\"aN6hrfyLwBl3PTnWKWWn_g--\"," +
                    "OAUTH_DOMAIN:\"entrasso-devtest.entraos.io/oauth2\"" +
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
