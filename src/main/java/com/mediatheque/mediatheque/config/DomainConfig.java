package com.mediatheque.mediatheque.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@Configuration
@EntityScan("com.mediatheque.mediatheque.domain")
@EnableJpaRepositories("com.mediatheque.mediatheque.repos")
@EnableTransactionManagement
public class DomainConfig {
}
