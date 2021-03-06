package com.uos.cinemaseoul.controller.movie;

import com.uos.cinemaseoul.common.constatnt.ConstantTable;
import com.uos.cinemaseoul.common.paging.MovieCriteria;
import com.uos.cinemaseoul.common.paging.MovieSearchCriteria;
import com.uos.cinemaseoul.common.paging.ReviewCriteria;
import com.uos.cinemaseoul.dto.movie.*;
import com.uos.cinemaseoul.service.movie.MovieService;
import com.uos.cinemaseoul.vo.common.CodeVo;
import com.uos.cinemaseoul.vo.movie.MovieVo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = "/movie")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;
    private final ConstantTable constantTable;

    @RequestMapping(value = "/add", method = RequestMethod.POST, consumes = "multipart/form-data")
    public ResponseEntity<?> insertMovie(@RequestPart(value = "movie") InsertMovieDto iMDto,
                                         @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        if(image != null){
            iMDto.setImage(image.getBytes());
        }
        return ResponseEntity.ok(movieService.insertMovie(iMDto));
    }

    @PostMapping("/updateGenre")
    public void insertMovie(@RequestBody InsertGenreDto iMDto){
        movieService.updateMovieGenre(iMDto);
    }

    @PostMapping("/updateCast")
    public void insertMovie(@RequestBody InsertCastDto iMDto){
        movieService.updateMovieCast(iMDto);
    }

    @DeleteMapping("/delete/{movi_id}")
    public void deleteMovie( @PathVariable(name = "movi_id") int movi_id){
        movieService.deleteMovie(movi_id);
    }

    @PutMapping("/update")
    public void updateMovie(@RequestBody UpdateMovieDto uMDto){
        movieService.updateMovie(uMDto);
    }

    @RequestMapping(value ="/image/{movi_id}", method = RequestMethod.PUT, consumes = "multipart/form-data")
    public void updateMovieImage(@PathVariable(name = "movi_id") int movi_id,
                                 @RequestPart(name = "image", required = false) MultipartFile image) throws IOException {
        MovieVo movieVo = new MovieVo();

        if(image != null){
            movieVo.setImage(image.getBytes());
        }
        movieVo.setMovi_id(movi_id);
        movieService.updateMovieImage(movieVo);
    }

    @GetMapping("/select/{movi_id}")
    public ResponseEntity<?> selectMovie(@PathVariable int movi_id){
        SelectMovieDto sMDto = movieService.selectMovie(movi_id);
        return ResponseEntity.ok(sMDto);
    }

    @PostMapping("/search")
    public ResponseEntity<?> searchMovie(@RequestBody MovieSearchCriteria movieSearchCriteria){
        MovieListDto movieListDto = movieService.searchMovie(movieSearchCriteria);
        return ResponseEntity.ok(movieListDto);
    }

    @PostMapping("/list")
    public ResponseEntity<?> selectMovieList(@RequestBody MovieCriteria movieCriteria){
        MovieListDto movieListDto = movieService.selectMovieList(movieCriteria);
        return ResponseEntity.ok(movieListDto);
    }

    @GetMapping("/genre/list")
    public ResponseEntity<?> selectGenreList(){
        List<CodeVo> genre = constantTable.childMap.get("????????????");
        return ResponseEntity.ok(genre);
    }

    @PostMapping("/review")
    public ResponseEntity<?> selectReviewList(@RequestBody ReviewCriteria reviewCriteria){
        return ResponseEntity.ok(movieService.getReview(reviewCriteria));

    }
}
