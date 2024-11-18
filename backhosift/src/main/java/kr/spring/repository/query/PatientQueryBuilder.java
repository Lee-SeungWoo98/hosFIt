package kr.spring.repository.query;



import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import kr.spring.entity.Patient;
import kr.spring.entity.Visit;

@Component
public class PatientQueryBuilder {
   
   public Specification<Patient> buildSpecification(String name, Long gender, Long tas, Long pain) {
       return (root, query, builder) -> {
           List<Predicate> predicates = new ArrayList<>();
           Join<Patient, Visit> visitJoin = root.join("visits", JoinType.INNER);
           
           if (name != null && !name.trim().isEmpty()) {
               predicates.add(builder.like(builder.lower(root.get("name")), 
                   "%" + name.toLowerCase() + "%"));
           }
           
           if (gender != null) {
               predicates.add(builder.equal(root.get("gender"), gender));
           }
           
           if (tas != null) {
               predicates.add(builder.equal(visitJoin.get("tas"), tas));
           }
           
           if (pain != null) {
               predicates.add(builder.equal(visitJoin.get("pain"), pain));
           }
           
           // staystatus 조건 추가 (만약 필요하다면)
           predicates.add(builder.equal(visitJoin.get("staystatus"), 1));
           
           // 중복 제거
           query.distinct(true);
           
           return builder.and(predicates.toArray(new Predicate[0]));
       };
   }
   
   public PageRequest buildPageRequest(int page, String sortBy) {
       Sort sort = Sort.by(Sort.Direction.ASC, sortBy != null ? sortBy : "subjectId");
       return PageRequest.of(page, 10, sort);
   }

   // 선택적: 각 조건을 별도 메소드로 분리
   private void addNamePredicate(List<Predicate> predicates, CriteriaBuilder builder, 
           Root<Patient> root, String name) {
       if (name != null && !name.trim().isEmpty()) {
           predicates.add(builder.like(builder.lower(root.get("name")), 
               "%" + name.toLowerCase() + "%"));
       }
   }
   
   private void addGenderPredicate(List<Predicate> predicates, CriteriaBuilder builder, 
           Root<Patient> root, Long gender) {
       if (gender != null) {
           predicates.add(builder.equal(root.get("gender"), gender));
       }
   }
   
   private void addTASPredicate(List<Predicate> predicates, CriteriaBuilder builder, 
           Join<Patient, Visit> visitJoin, Long tas) {
       if (tas != null) {
           predicates.add(builder.equal(visitJoin.get("tas"), tas));
       }
   }
   
   private void addPainPredicate(List<Predicate> predicates, CriteriaBuilder builder, 
           Join<Patient, Visit> visitJoin, Long pain) {
       if (pain != null) {
           predicates.add(builder.equal(visitJoin.get("pain"), pain));
       }
   }
}