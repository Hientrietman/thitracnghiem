package com.prelude.thitracnghiem_backend.repositories;

import com.prelude.thitracnghiem_backend.models.Question;
import com.prelude.thitracnghiem_backend.models.QuestionPool;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    Page<Question> findByPool(QuestionPool pool, Pageable pageable);
    List<Question> findAllByPool(QuestionPool pool);
}