import React, { useEffect, useState } from 'react';
import { ImgComponent, ModalComponent, PageTitle } from '../../Components';
import { ProductType, CodeMatch } from '../../Main/Type';
import { useProductTypeCodeState } from '../../Main/CodeModel';
import "../../scss/pages/store.scss";

import axios from 'axios';
import { useTokenState } from '../../Main/TokenModel';
import { SERVER_URL } from '../../CommonVariable';
import { errorHandler } from '../../Main/ErrorHandler';
import { ProductCard } from '../../Components';
import { Button, FormControl, InputLabel, Menu, MenuItem, Modal, Select, Tab, Tabs, TextField } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

const AdminProduct = () => {
	const AUTH_TOKEN = useTokenState();
	const productType = useProductTypeCodeState();
	const [productTypeObj, setProductTypeObj] = useState<CodeMatch>({});

	/* 상품 조회 */
	const [productList, setProductList] = useState<ProductType[] | undefined>(undefined);
	const [mode, setMode] = useState<number>(0); // 0 : 전체, 1: 굿즈, 2: 스낵

	/* 상품 추가 */
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [prodName, setProdName] = useState<string>("");
	const [price, setPrice] = useState<number>(0);
	const [prodType, setProdType] = useState<string>("310001");
	const [limit, setLimit] = useState<number>(0);
	const [contents, setContents] = useState<string>("");
	const [imgFile, setImgFile] = useState<File | undefined>(undefined);

	useEffect(() => {
		fetchFromMode();
	}, [mode]);

	useEffect(() => {
		fetchAllProduct();
	}, []);

	/** 페이지네이션 */
	const [page, setPage] = useState<number>(1);
	const [totalPage, setTotalPage] = useState<number>(1);

	useEffect(() => {
		// stat과 sort는 바뀔 때마다 재구성
		fetchAllProduct();
	}, [page]);
	
	const handlePageChange = (e: any, pageNumber: number) => { setPage(pageNumber); };

	/* 타입 코드 */
	useEffect(() => {
		const obj: CodeMatch = {};
		for (const code in productType) {
			obj[Number(code)] = productType[code].code_name;
		}
		setProductTypeObj(obj);
	}, [productType]);


	const fetchFromMode = () => {
		let type = "";
		if (mode !== 0) {
			type = productType[mode-1].code_id;
		}

		switch (mode) {
		case 0:
			fetchAllProduct();
			break;
		case 1:
		case 2:
			fetchAllProduct(type);
			break;

		}
	}

	const fetchAllProduct = (typeString?: string) => {
		// 전체 상품 받아오기
		axios.post(`${SERVER_URL}/prod/list`, {
			page: page,
			amount: 10,
			prod_type_code: typeString ? typeString : null
		})
			.then((res) => {
				if (!res.data || !res.data.products)
					return;
				setProductList(res.data.products);
				setTotalPage(res.data.totalpage);
			})
			.catch((e) => {
				errorHandler(e, true);
			});
	}

	/* 상품 추가 */
	const handlePriceChange = (e: any) => {
		if (isNaN(Number(e.target.value))) {
			alert("숫자를 입력해주세요.");
			return;
		}
		setPrice(Number(e.target.value));
	}

	const handleLimitChange = (e: any) => {
		if (isNaN(Number(e.target.value))) {
			alert("숫자를 입력해주세요.");
			return;
		}
		setLimit(Number(e.target.value));
	}

	const saveProduct = () => {
		// 상품 추가
		const formData = new FormData();
		if (imgFile) {
			formData.append("image", imgFile);
		}
		const jsonData = JSON.stringify({
			"prod_name": prodName,
			"price": price.toString(),
			"prod_type_code": prodType,
			"limit": limit,
			"prod_contents": contents
		});

		const blobData = new Blob([jsonData], { type: 'application/json' });
		formData.append("product", blobData);

		axios.post(`${SERVER_URL}/prod`, formData, {
			headers: {
				TOKEN: AUTH_TOKEN
			}
		})
			.then((res) => {
				alert("상품이 정상적으로 추가되었습니다.");
				fetchFromMode();
				setOpenModal(false);
			})
			.catch((e) => {
				errorHandler(e, true);
			});
	}

	const deleteProduct = (prod_id : number) => {
		if(!confirm("상품을 정말로 삭제하시겠습니까?")){
			return;
		}

		// 상품 삭제
		axios.delete(`${SERVER_URL}/prod/delete/${prod_id}`, {
			headers: {
				TOKEN: AUTH_TOKEN
			}
		})
			.then((res) => {
				alert("상품이 정상적으로 삭제되었습니다.");
				fetchFromMode();
			})
			.catch((e) => {
				errorHandler(e, true);
			});
	}

	return (
		<div>
			<PageTitle title="상품 목록 리스트" isButtonVisible={false} />
			<div className="add-btn-con">
				<Button variant="outlined" color="primary" onClick={() => setOpenModal(true)}>상품 추가</Button>
			</div>
			<div className="product-list-con">
				<Tabs
					value={mode}
					onChange={(e: any, newValue: number) => {
						setMode(newValue)
					}}
					className="product-tab"
					indicatorColor="primary"
				>
					<Tab label="전체" />
					<Tab label="스낵" />
					<Tab label="굿즈" />
				</Tabs>
				<div className="contents-con">
					{
						productList &&
						productList.map((product) =>
							<ProductCard
								key={product.prod_id}
								product={product}
								auth="admin"
								deleteFunction={() => deleteProduct(product.prod_id)}
							/>
						)
					}
				</div>
				<Pagination className="pagination" count={totalPage} page={page} onChange={handlePageChange} />
			</div>
			<ModalComponent
				open={openModal}
				setOpen={setOpenModal}
				title="상품 추가"
				button="추가"
				buttonOnClick={saveProduct}
			>
				<div className="add-product-modal">
					<div>
						<TextField className="product-input" variant="outlined" label="상품 이름" InputLabelProps={{shrink:true}} inputProps={{ maxLength: 30 }} value={prodName} onChange={(e: any) => setProdName(e.target.value)} />
						<TextField className="product-input" variant="outlined" label="가격" InputLabelProps={{shrink:true}} value={price} onChange={handlePriceChange} />
					</div>
					<div>
						<TextField className="product-input" variant="outlined" label="재고" InputLabelProps={{shrink:true}} value={limit} onChange={handleLimitChange} />
						<FormControl>
							<InputLabel id="select-label">상품 타입</InputLabel>
							<Select
								className="product-input"
								labelId="select-label"
								value={prodType}
								onChange={(e: any) => setProdType(e.target.value)}
							>
								{
									productType.map((type) => {
										return (
											<MenuItem key={type.code_id} value={type.code_id}>{type.code_name}</MenuItem>
										)
									})
								}
							</Select>
						</FormControl>
					</div>
					<TextField className="product-input-long" variant="outlined" label="설명" InputLabelProps={{shrink:true}} multiline={true} inputProps={{ maxLength: 1000 }} value={contents} onChange={(e: any) => setContents(e.target.value)} />
					<ImgComponent setImgFile={setImgFile}/>
				</div>
			</ModalComponent>
		</div>
	);
}

export default AdminProduct;