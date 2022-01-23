package com.syr.parley.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.syr.parley.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InterviewTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Interview.class);
        Interview interview1 = new Interview();
        interview1.setId(1L);
        Interview interview2 = new Interview();
        interview2.setId(interview1.getId());
        assertThat(interview1).isEqualTo(interview2);
        interview2.setId(2L);
        assertThat(interview1).isNotEqualTo(interview2);
        interview1.setId(null);
        assertThat(interview1).isNotEqualTo(interview2);
    }
}
