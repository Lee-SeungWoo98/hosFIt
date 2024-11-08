package kr.spring.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import kr.spring.entity.ErrorLog;


public interface ErrorRepository extends JpaRepository<ErrorLog, Long> {

	ErrorLog save(ErrorLog error);

	
}
