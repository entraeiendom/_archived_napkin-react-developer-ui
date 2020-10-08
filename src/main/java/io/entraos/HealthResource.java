package io.entraos;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.lang.management.ManagementFactory;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Enumeration;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/napkin")
public class HealthResource {

    private static final Logger log = LoggerFactory.getLogger(HealthResource.class);
    private static boolean status = true;
    private static final String applicationInstanceName = MainApplication.APPLICATION_NAME;


    private HealthReport report = new HealthReport("no.entra.entraos.api", applicationInstanceName, applicationInstanceName);
    public static final String STATUS_KEY = "Status";
    public static final String IP = "ip";
    public static final String VERSION_KEY = "version";
    public static final String NOW_KEY = "now";
    public static final String RUNNING_SINCE_KEY = "running since";
    public static final String NAME_KEY = "name";


    @GetMapping(value = "/health", produces = "application/json; charset=UTF-8")
    public String getHealth(HttpServletResponse response) {
        report.put(STATUS_KEY, String.valueOf(status));
//        report.put(NAME_KEY, applicationInstanceName);
//        report.put(IP,getMyIPAddresssString());
//        report.put(VERSION_KEY,getVersion());
        report.put(NOW_KEY, Instant.now().toString());
//        report.put(RUNNING_SINCE_KEY, getRunningSince());
        return report.getReport();
    }


    public static String getRunningSince() {
        long uptimeInMillis = ManagementFactory.getRuntimeMXBean().getUptime();
        return Instant.now().minus(uptimeInMillis, ChronoUnit.MILLIS).toString();
    }


    public static String getMyIPAddresssesString() {
        String ipAdresses = "";

        try {
            ipAdresses = InetAddress.getLocalHost().getHostAddress();
            Enumeration n = NetworkInterface.getNetworkInterfaces();

            while (n.hasMoreElements()) {
                NetworkInterface e = (NetworkInterface) n.nextElement();

                InetAddress addr;
                for (Enumeration a = e.getInetAddresses(); a.hasMoreElements(); ipAdresses = ipAdresses + "  " + addr.getHostAddress()) {
                    addr = (InetAddress) a.nextElement();
                }
            }
        } catch (Exception e) {
            ipAdresses = "Not resolved";
        }

        return ipAdresses;
    }

    public static String getMyIPAddresssString() {
        String fullString = getMyIPAddresssesString();
        return fullString.substring(0, fullString.indexOf(" "));
    }
}
