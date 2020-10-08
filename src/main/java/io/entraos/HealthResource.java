package io.entraos;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.time.Instant;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/")
public class HealthResource {

    private static final Logger log = LoggerFactory.getLogger(HealthResource.class);
    private static boolean status = true;
    private static final String applicationInstanceName = MainApplication.APPLICATION_NAME;


    private HealthReport report = new HealthReport("io.entraos", applicationInstanceName, applicationInstanceName);
    public static final String STATUS_KEY = "Status";
    public static final String IP = "ip";
    public static final String NOW_KEY = "now";
    public static final String RUNNING_SINCE_KEY = "running since";
    public static final String NAME_KEY = "name";


    @GetMapping(value = "/health", produces = "application/json; charset=UTF-8")
    public String getHealth(HttpServletResponse response) {
        report.put(STATUS_KEY, String.valueOf(status));
        report.put(NOW_KEY, Instant.now().toString());
        return report.getReport();
    }


}
