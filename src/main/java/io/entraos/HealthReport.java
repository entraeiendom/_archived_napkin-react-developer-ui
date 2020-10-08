package io.entraos;

import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URL;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;

public class HealthReport {
    Map<String, Function<String, String>> registeredMap = new HashMap();
    Map<String, String> reportMap = new HashMap();
    Map<String, String> keyNameDisplayList = new HashMap();
    Set<String> refreshList = new HashSet();
    private String group;
    private String artifact;
    private String instanceName = "";

    public HealthReport(String group, String artifact, String instanceName) {
        this.group = group;
        this.artifact = artifact;
        this.instanceName = instanceName;
    }

    public HealthReport put(String keyName, Function<String, String> func) {
        this.registeredMap.put(keyName, func);
        this.reportMap.put(keyName, func.apply(keyName));
        return this;
    }

    public HealthReport put(String keyName, String keyNameDisplay, Function<String, String> func) {
        this.keyNameDisplayList.put(keyName, keyNameDisplay);
        return this.put(keyName, func);
    }

    public HealthReport put(String keyName, String value) {
        this.reportMap.put(keyName, value);
        return this;
    }


    public void recompute(String name) {
        this.refreshList.add(name);
    }

    public String getReport() {
        this.refreshList.forEach((i) -> {
            if (this.registeredMap.containsKey(i)) {
                this.reportMap.put(i, (String) null);
            }

        });
        return this.render();
    }

    private String render() {
        this.refreshList.forEach((i) -> {
            this.reportMap.compute(i, (k, v) -> {
                return v == null && this.registeredMap.containsKey(k) ? String.valueOf(((Function) this.registeredMap.get(k)).apply(k)) : v;
            });
        });
        StringBuilder sb = new StringBuilder();
        sb.append("{\n");
        sb.append(" \"").append("version").append("\"").append(":").append("\"").append(this.getVersion()).append("\"").append(",\n");
        sb.append(" \"").append("name").append("\"").append(":").append("\"").append(this.instanceName).append("\"").append(",\n");
        sb.append(" \"").append("now").append("\"").append(":").append("\"").append(Instant.now()).append("\"").append(",\n");
        sb.append(" \"").append("ip").append("\"").append(":").append("\"").append(this.getMyIPAddresssesString()).append("\"").append(",\n");
        sb.append(" \"").append("running since").append("\"").append(":").append("\"").append(getRunningSince()).append("\"").append(",\n");
        Iterator var2 = this.reportMap.keySet().iterator();

        String resultString;
        while (var2.hasNext()) {
            resultString = (String) var2.next();
            sb.append(" \"").append(this.keyNameDisplayList.containsKey(resultString) ? (String) this.keyNameDisplayList.get(resultString) : resultString).append("\"").append(":").append("\"").append((String) this.reportMap.get(resultString)).append("\"").append(",\n");
        }

        String trmpstring = sb.toString();
        resultString = trmpstring.substring(0, trmpstring.length() - 2) + "}\n";
        sb.append("}\n");
        return resultString;
    }

    public static String getRunningSince() {
        long uptimeInMillis = ManagementFactory.getRuntimeMXBean().getUptime();
        return Instant.now().minus(uptimeInMillis, ChronoUnit.MILLIS).toString();
    }

    public String getMyIPAddresssesString() {
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
        } catch (Exception var6) {
            ipAdresses = "Not resolved";
        }

        return ipAdresses;
    }

    public synchronized String getVersion() {
        Properties mavenProperties = new Properties();
        String resourcePath = "/META-INF/maven/" + group + "/" + artifact + "/pom.properties";

        URL mavenVersionResource = HealthResource.class.getResource(resourcePath);
        if (mavenVersionResource != null) {
            try {
                mavenProperties.load(mavenVersionResource.openStream());
                return mavenProperties.getProperty("version", "missing version info in " + resourcePath);
            } catch (IOException e) {
//                log.warn("Problem reading version resource from classpath: ", e);
            }
        }
        return "(DEV VERSION)" + " [" + artifact + " - " + getMyIPAddresssesString() + "]";
    }

}
