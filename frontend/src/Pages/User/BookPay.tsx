import React, { useState } from 'react';

import { getDateString } from '../../Function';
import { ShowScheduleType } from '../../Main/Type';
import { Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, TextField, Button } from '@material-ui/core';
import { usePayTypeCodeState } from '../../Main/CodeModel';

import axios from 'axios';
import { SERVER_URL } from '../../CommonVariable';
import { errorHandler } from '../../Main/ErrorHandler';
import { useTokenState } from '../../Main/TokenModel';
import { useUserState } from '../../Main/UserModel';
import { useHistory } from 'react-router';

type Props = {
	mode: number;
	scheduleInfo: ShowScheduleType;
	payPrice: number;
	seatTypeNum: number[];
	seatNum: number[];
}

const BookPay = ({ mode, scheduleInfo, payPrice, seatTypeNum, seatNum }: Props) => {
	const history = useHistory();
	const AUTH_TOKEN = useTokenState();
	const payTypeCode = usePayTypeCodeState();
	const userId = useUserState();
	const [payType, setPayType] = useState<string>("");
	const [currentPoint, setCurrentPoint] = useState<number>(0);
	const [pointMoney, setPointMoney] = useState<number>(0);

	const getEndTimeString = (end_time: string) => {
		const arr = end_time.split("/");
		return arr[0] + "-" + arr[1] + "-" + arr[2];
	}

	const handlePointMoneyChange = (e: any) => {
		const money = Number(e.target.value);
		if (money > currentPoint) {
			alert("현재 보유하고 있는 포인트보다 많이 쓸 수 없습니다.");
			return;
		}
		setPointMoney(money);
	}

	const fetchPoint = () => {
		// todo : token 나중에 체크하는 걸로 변동되면 고치기
		axios.get(`${SERVER_URL}/point/${userId}`)
			.then((res) => {
				const num = Number(res.data);
				if (isNaN(num))
					return;
				setCurrentPoint(num);
			})
			.catch((e) => {
				errorHandler(e, true);
			});
	}

	const bookPay = () => {
		axios.post(`${SERVER_URL}/pay/book`, {
			show_id: scheduleInfo.show_id,
			user_id: userId,
			teen: seatNum[0],
			adult: seatNum[1],
			senior: seatNum[2],
			impaired: seatNum[3],
			hall_id: scheduleInfo.hall_id,
			seat_list: seatTypeNum,
			use_point: pointMoney, //사용한 포인트, 없으면 0
			price: payPrice - pointMoney, //실제 결제 된 금액
			pay_type_code: payType
		}, {
			headers : {
				TOKEN: AUTH_TOKEN
			}
		})
			.then((res) => {
				alert("성공적으로 예매되었습니다.");
				history.push("/myPage");
			})
			.catch((e) => {
				errorHandler(e, true);
			});

	}

	return (
		<div className="book-pay-con">
			<div className="info-con">
				<div className="top-title">예매정보</div>
				<div className="schedule-info-con">
					<img className="full-width" src="https://caching.lottecinema.co.kr//Media/MovieFile/MovieImg/202105/17387_103_1.jpg" alt="포스터" />
					<div>
						<div className="movie-name">{scheduleInfo.movi_name}</div>
						<div>
							<div>{getDateString(scheduleInfo.show_date)} ~ {getEndTimeString(scheduleInfo.end_time)}</div>
						</div>
						<div>
							{scheduleInfo.hall_name}
						</div>
					</div>
				</div>
			</div>
			<div className="pay-type-con">
				<div className="top-title">결제정보</div>
				<div className="selected-seat-con">
					<div>선택한 좌석 : </div>
					{
						seatTypeNum.map((seat_num: number) =>
							<div key={seat_num}>{seat_num}</div>
						)
					}
				</div>
				<FormControl>
					<FormLabel>최종 결제 수단</FormLabel>
					<RadioGroup name="state" value={payType} onChange={(e: any) => setPayType(e.target.value)}>
						{
							payTypeCode.map((code) =>
								<FormControlLabel key={code.code_id} value={code.code_id} control={<Radio color="primary" />} label={code.code_name} />
							)
						}
					</RadioGroup>
				</FormControl>
				<div className="point-con">
					<TextField
						label="할인권"
						value={pointMoney}
						onChange={handlePointMoneyChange}
					></TextField>
					<div className="current-point-con">
						<div>{currentPoint}</div>
						<Button variant="outlined" color="primary" onClick={fetchPoint}>포인트 불러오기</Button>
					</div>
				</div>
			</div>
			<div className="result-pay-con">
				<div className="top-title">결제하기</div>
				<div className="total-price">
					<div>최종금액</div>
					<div>{payPrice - pointMoney}</div>
				</div>
				<div>
					<Button variant="contained" color="secondary" onClick={bookPay}>결제하기</Button>
				</div>
			</div>
		</div>
	);
}

export default BookPay;