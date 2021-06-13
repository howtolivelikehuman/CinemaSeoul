import { AxiosError } from "axios";

export const errorHandler = (error: AxiosError, alertOn: boolean, errorMsg?: string[]) => {
	if (error.response) {
		// 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
		console.log("error catch");
		console.log(error.response.data);
		console.log(error.response.status);
		console.log(error.response.headers);
		if (alertOn) { // alert를 수행할 지 결정
			switch (error.response.status) {
			case 400:
				errorMsg && errorMsg[0] !== "" ?
					alert(errorMsg[0]) :
					alert("잘못된 정보입니다. 입력된 정보를 확인하세요.");
				break;
			case 401:
				errorMsg && errorMsg[1] !== "" ?
					alert(errorMsg[1]) :
					alert("잘못된 정보입니다. 입력된 정보를 확인하세요.");
				break;
			case 403:
				errorMsg && errorMsg[2] !== "" ?
					alert(errorMsg[2]) :
					alert("권한 인증에 실패하였습니다.");
				break;
			case 404:
				errorMsg && errorMsg[3] !== "" ?
					alert(errorMsg[3]) :
					alert("해당 리소스가 없습니다.");
				break;
			case 405:
				errorMsg && errorMsg[4] !== "" ?
					alert(errorMsg[4]) : 
					alert("허용되지 않는 요청입니다.");
				break;
			case 500:
				errorMsg && errorMsg[5] !== "" ?
					alert(errorMsg[5]) :
					alert("서버의 응답이 없습니다. 잠시 후 다시 시도해주세요.");
				break;
			}
		}
	}
	else if (error.request) {
		// 요청이 이루어 졌으나 응답을 받지 못했습니다.
		// `error.request`는 XMLHttpRequest 인스턴스입니다.
		console.log("error catch");
		console.log(error.request);
	}
	else {
		// 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
		console.log('Error', error.message);
	}
	console.log(error.config);
}