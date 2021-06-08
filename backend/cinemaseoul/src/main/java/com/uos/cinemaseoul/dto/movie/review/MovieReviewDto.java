package com.uos.cinemaseoul.dto.movie.review;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieReviewDto {
    private String comments;
    private Integer rating;
    private int movi_id;
    private String movi_name;
    @JsonIgnore
    private byte[] images;
    private String imageBase64;
}
