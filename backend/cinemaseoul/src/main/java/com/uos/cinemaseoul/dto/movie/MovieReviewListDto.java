package com.uos.cinemaseoul.dto.movie;

import com.uos.cinemaseoul.common.paging.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieReviewListDto extends PageInfo {
    List<ReviewShortDto> reviews = new ArrayList<>();
}
