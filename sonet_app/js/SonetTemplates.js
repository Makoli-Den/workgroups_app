class SonetTemplates {
	#sonetTemplatesMapper = new Object();
	#sonetFieldsMapper = new Object({
		GROUP_NAME: "NAME",
		GROUP_DESCRIPTION: "DESCRIPTION",
		GROUP_VISIBLE: "VISIBLE",
		GROUP_OPENED: "OPENED",
		GROUP_KEYWORDS: "KEYWORDS",
		GROUP_INITIATE_PERMS: "INITIATE_PERMS",
		GROUP_CLOSED: "CLOSED",
		GROUP_SPAM_PERMS: "SPAM_PERMS",
		GROUP_IS_PROJECT: "PROJECT",
		GROUP_PROJECT_DATE_FINISH: "PROJECT_DATE_FINISH",
		GROUP_PROJECT_DATE_START: "PROJECT_DATE_START",
		GROUP_SCRUM_MASTER_ID: "SCRUM_MASTER_ID"
	});
	#sonetApp;
	constructor(sonetApp) {
		this.#sonetApp = sonetApp;
		this.#getSonetTemplatesFields((result) => {
			if (result.error())
				console.log(result.error());
			else {
				let data = result.data();
				console.log(data);
				Object.keys(data).forEach(element => {
					this.#sonetTemplatesMapper[data[element].CODE || data[element].FIELD_ID] = element;
				});
			}
		});
	}
	#getSonetTemplatesFields(callback) {
		let params = {
			'IBLOCK_TYPE_ID': 'lists',
			'IBLOCK_ID': 58
		};
		BX24.callMethod(
			'lists.field.get',
			params,
			callback
		);
	}
	demap(data) {
		Object.keys(this.#sonetTemplatesMapper).forEach(element => {
			if (element == "NAME" || element == "DETAIL_TEXT") return;
			let bitrixCal = this.#sonetTemplatesMapper[element];
			if (data.hasOwnProperty(bitrixCal)) {
				let value;
				Object.keys(data[bitrixCal]).forEach(element => {
					value = data[bitrixCal][element];
				});
				data[element] = value;
				delete data[bitrixCal];
			} else {
				data[element] = data[element] || undefined;
			}
		});
	}
	getSonetTemplates = function (callback) {
		let params = {
			'IBLOCK_TYPE_ID': 'lists',
			'IBLOCK_ID': 58
		};
		BX24.callMethod(
			'lists.element.get',
			params,
			callback
		);
	}
	createSonetGroup = function () {
		BX24.callMethod(
			'sonet_group.create', {
				'NAME': 'Test sonet group',
				'VISIBLE': 'Y',
				'OPENED': 'N',
				'INITIATE_PERMS': 'K'
			}
		);
	}
	addSonetTemplate = function (data, id, modalPage) {
		let sendData = new Object();
		for (const key of data.keys()) {
			if (data.get(key)) {
				switch (key) {
					case "template-name":
						sendData[key.toUpperCase().split('-')[1]] = data.get(key);
						break;
					case "template-description":
						sendData["DETAIL_TEXT"] = data.get(key);
						break;
					default:
						sendData[key.toUpperCase().replaceAll('-', '_')] = data.get(key);
						break;
				}
			}
		}
		Object.keys(sendData).forEach(element => {
			sendData[this.#sonetTemplatesMapper[element]] = sendData[element];
			if (element != "NAME" && element != "DETAIL_TEXT") delete sendData[element];
		});
		let params = {
			'IBLOCK_TYPE_ID': 'lists',
			'IBLOCK_ID': 58,
			'ELEMENT_ID': id,
			'FIELDS': sendData
		};
		BX24.callMethod(
			'lists.element.add',
			params,
			function (result) {
				if (result.error())
					alert("Error: " + result.error());
				else
					alert("Success: " + result.data());
				sonetTemplates.getSonetTemplates(sonetApp.displaySonetTemplates);
			}
		);
		modalPage.dispose();
	}
	editSonetTemplate = function (data, id, modalPage) {
		let sendData = new Object();
		for (const key of data.keys()) {
			if (data.get(key)) {
				switch (key) {
					case "template-name":
						sendData[key.toUpperCase().split('-')[1]] = data.get(key);
						break;
					case "template-description":
						sendData["DETAIL_TEXT"] = data.get(key);
						break;
					default:
						sendData[key.toUpperCase().replaceAll('-', '_')] = data.get(key);
						break;
				}
			}
		}
		Object.keys(sendData).forEach(element => {
			sendData[this.#sonetTemplatesMapper[element]] = sendData[element];
			if (element != "NAME" && element != "DETAIL_TEXT") delete sendData[element];
		});
		let params = {
			'IBLOCK_TYPE_ID': 'lists',
			'IBLOCK_ID': 58,
			'ELEMENT_ID': id,
			'FIELDS': sendData
		};
		BX24.callMethod(
			'lists.element.update',
			params,
			function (result) {
				if (result.error())
					alert("Error: " + result.error());
				else
					alert("Success: " + result.data());
				sonetTemplates.getSonetTemplates(sonetApp.displaySonetTemplates);
			}
		);
		modalPage.dispose();
	}
	deleteSonetTemplate = function (id, callback) {
		let params = {
			'IBLOCK_TYPE_ID': 'lists',
			'IBLOCK_ID': 58,
			'ELEMENT_ID': id
		};
		BX24.callMethod(
			'lists.element.delete',
			params,
			callback
		);
	}
	createTaskInTemplate(data, id, modalPage) {
		window.tempDataaaaaaa = data;
		window.tempMooooooodalPage = modalPage;
		window.tempIdddd = id;
		Object.keys(tempTaskList).forEach(element => {

			let params = {
				'IBLOCK_TYPE_ID': 'lists',
				'IBLOCK_ID': 62,
				'ELEMENT_ID': id,
				'FIELDS': {
					'NAME': element,
					'DETAIL_TEXT': tempTaskList[element]["task-desc"],
					'PROPERTY_178': id,
				}
			};
			BX24.callMethod(
				'lists.element.add',
				params,
				function (result) {
					if (result.error()) {
						console.log("Error: " + result.error());
					} else {
						console.log("Success: " + result.data());
						let dataa = window.tempDataaaaaaa;
						let paramsss = {
							'IBLOCK_TYPE_ID': 'lists',
							'IBLOCK_ID': 58,
							'ELEMENT_ID': id,
							'FIELDS': {
								DETAIL_TEXT: dataa.get("template-description"),
								NAME: dataa.get("template-name"),
								PROPERTY_140: dataa.get("group-visible"),
								PROPERTY_142: dataa.get("group-name"),
								PROPERTY_144: dataa.get("group-description"),
								PROPERTY_146: dataa.get("group-opened"),
								PROPERTY_148: dataa.get("group-keywords"),
								PROPERTY_150: dataa.get("group-initiate-perms"),
								PROPERTY_152: dataa.get("group-closed"),
								PROPERTY_154: dataa.get("group-spam-perms"),
								PROPERTY_156: dataa.get("group-is-project"),
								PROPERTY_180: [result.data()]
							},
						};
						BX24.callMethod(
							'lists.element.update',
							paramsss,
							function (result) {
								if (result.error())
									alert("Error: " + result.error());
								else
									alert("Success: " + result.data());
								sonetTemplates.getSonetTemplates(sonetApp.displaySonetTemplates);
							}
						);

					}
						
				}
			);

		});
		window.somenewvalueid = id;
		
	}
	createSonetByTemplate = function (data, id, modalPage, start, finish) {
		window.tempStart = start;
		window.tempFinish = finish;
		window.tempIddddddd = id;
		let template = sonetTemplatesList[id];
		let params = new Object();
		for (const key of data.keys()) {
			if (data.get(key)) {
				switch (key) {
					case "template-name":
						params[key.toUpperCase().split('-')[1]] = data.get(key);
						break;
					case "template-description":
						params["DETAIL_TEXT"] = data.get(key);
						break;
					default:
						params[key.toUpperCase().replaceAll('-', '_')] = data.get(key);
						break;
				}
			}
		}
		Object.keys(template).forEach(element => {
			if (params.hasOwnProperty(element)) {
				params[this.#sonetFieldsMapper[element]] = params[element];
				delete params[element];
			} else if (this.#sonetFieldsMapper.hasOwnProperty(element)) {
				let value = template[element];
				if (value) {
					params[this.#sonetFieldsMapper[element]] = template[element];
				}
			}
		});
		Object.keys(params).forEach(element => {
			if (element.includes("CLOSED") || element.includes("VISIBLE") || element.includes("OPENED") || element.includes("PROJECT")) {
				if (Number(params[element]) === 1) {
					params[element] = "Y";
				} else if (Number(params[element]) === 0) {
					params[element] = "N";
				}
			}
		});
		BX24.callMethod(
			'sonet_group.create',
			params,
			function (result) {
				if (result.error()) {
					//alert("Error: " + result.error());
				} else {
					//alert("Success: " + result.data());
					sonetTemplates.getSonetTemplates(sonetApp.displaySonetTemplates);
					let userIds = new Array();
					Object.keys(selectedUsersList).forEach(element => {
						userIds.push(element);
					});
					window.sonetIddddddd = result.data();
					BX24.callMethod('sonet_group.user.add', {
						GROUP_ID: result.data(),
						USER_ID: userIds,
					},
					function(result) {
						let params = {
							'IBLOCK_TYPE_ID': 'lists',
							'IBLOCK_ID': 58,
							'ELEMENT_ID': window.tempIddddddd,
						};
						BX24.callMethod(
							'lists.element.get',
							params,
							function(result) {
								console.log(result.data()[0].PROPERTY_180);
								Object.keys(result.data()[0].PROPERTY_180).forEach(element => {
									let taskID = result.data()[0].PROPERTY_180[element];

									let params = {
										'IBLOCK_TYPE_ID': 'lists',
										'IBLOCK_ID': 62,
										'ELEMENT_ID': taskID,
									};
									BX24.callMethod(
										'lists.element.get',
										params,
										function(result) {
											console.log(result.data());
											result.data().forEach(element => {

												BX24.callMethod(
													'tasks.task.add', 
													{
														fields: {
															TITLE: element.NAME,
															DESCRIPTION: element.DETAIL_TEXT,
															RESPONSIBLE_ID: 1,
															DATE_START: window.tempStart,
															DEADLINE: window.tempFinish,
															START_DATE_PLAN: window.tempStart,
															END_DATE_PLAN: window.tempFinish,
															GROUP_ID: window.sonetIddddddd[0],
														}
													}, 
													function(res) {
														console.log(res);
													}
												 );

											});
										},
									);
								});
							},
						);
					});
				}
			}
		);
	}
}