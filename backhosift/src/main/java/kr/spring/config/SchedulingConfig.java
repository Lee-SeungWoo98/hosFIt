package kr.spring.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import java.util.concurrent.ScheduledFuture;

@EnableScheduling
@Configuration
public class SchedulingConfig implements SchedulingConfigurer {
    private ScheduledFuture<?> scheduledFuture;
    private ThreadPoolTaskScheduler taskScheduler;
    private boolean isSchedulerRunning = false;

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.setPoolSize(1);
        taskScheduler.setThreadNamePrefix("scheduled-task-");
        taskScheduler.initialize();
        taskRegistrar.setTaskScheduler(taskScheduler);
    }

    public boolean toggleScheduler() {
        if (isSchedulerRunning) {
            stopScheduler();
        } else {
            startScheduler();
        }
        return isSchedulerRunning;
    }

    public void startScheduler() {
        if (!isSchedulerRunning && scheduledFuture == null) {
            isSchedulerRunning = true;
        }
    }

    public void stopScheduler() {
        if (scheduledFuture != null) {
            scheduledFuture.cancel(false);
            scheduledFuture = null;
            isSchedulerRunning = false;
        }
    }

    public boolean isSchedulerRunning() {
        return isSchedulerRunning;
    }
}