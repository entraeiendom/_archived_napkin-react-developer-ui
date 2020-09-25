package io.entraos;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;


@Configuration
@PropertySource(value = "file:local_config.properties", ignoreResourceNotFound = true)
public class Config {

}

