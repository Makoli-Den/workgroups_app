class SonetApplication {
	#sonetTemplatesListLink;
	#sonetTemplates;
	constructor(sonetTemplatesList = []) {
		this.#sonetTemplatesListLink = sonetTemplatesList;
	}
	setSonetTemplates(sonetTemplates) {
		this.#sonetTemplates = sonetTemplates;
	}
	displaySonetTemplates = (result) => {
		if (result.error()) {
			console.error(result.error());
		} else {
			let templates = result.data();
			let templateHTML = '';
			for (let templateIndex in templates) {
				let template = templates[templateIndex];
				this.#sonetTemplatesListLink[template.ID] = template;
				templateHTML += `
					<tr>
						<td>${Number(templateIndex) + 1}</td>
						<td>${template.NAME}</td>
						<td>${template.ID}</td>
						<td>${template.DETAIL_TEXT}</td>
						<td>
							<ul class="action-list">
								<li>
									<a id="${template.ID}" class="add-sonet" data-tip="Создать проект по шаблону" onclick="sonetApp.onCreateProjectButtonPressed(event)">
										<p id="${template.ID}" >Создать проект </p>
										<i id="${template.ID}" class="fa fa-plus-square-o"></i>
									</a>
								</li>
								<li class="separated">
									<a data-tip="Редактировать" onclick="sonetApp.onEditButtonPressed(event)">
										<i id="${template.ID}" class="fa fa-edit"></i>
									</a>
								</li>
								<li>
									<a data-tip="Удалить" onclick="sonetApp.onDeleteButtonPressed(event)">
										<i id="${template.ID}" class="fa fa-trash"></i>
									</a>
								</li>
							</ul>
						</td>
					</tr>
				`;
			}
			if (result.more()) {
				result.next();
			} else {
				$('#sonet-list').html(templateHTML);
				$('#dimmer').hide();
				$('#spinner').hide();
			}
		}
	}
	onEditButtonPressed = (event) => {
		let target = event.target || event.srcElement;
		let id = target.parentElement.id || target.id;
		let template = this.#sonetTemplatesListLink[id];
		this.#sonetTemplates.demap(template);
		if (!template) {
			console.error(`В списке шаблонов не найден Шаблон с ID: ${id}`);
			alert(`В списке шаблонов не найден Шаблон с ID: ${id}`);
			return;
		}
		let modalPage = new ItcModal(
			new Object({
				title: `Редактирование шаблона: "${template.NAME}" с ID: ${template.ID}`,
				id: id,
				operation: "edit",
				footerButtons: new Array(
					new Object({
						class: "button-19",
						text: "Применить изменения",
						type: 'submit',
					}),
				)
			})
		);

		modalPage.addLabel(new Object({
			label: 'Название шаблона группы',
			type: 'text',
			fieldId: `template-name`,
			value: template["NAME"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Описание шаблона группы',
			type: 'text',
			fieldId: `template-description`,
			value: template["DETAIL_TEXT"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Название группы',
			type: 'text',
			fieldId: `group-name`,
			value: template["GROUP_NAME"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Описание группы',
			type: 'text',
			fieldId: `group-description`,
			value: template["GROUP_DESCRIPTION"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Ключевые слова группы',
			type: 'text',
			fieldId: `group-keywords`,
			value: template["GROUP_KEYWORDS"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Видим в списке групп?',
			type: 'text',
			fieldId: `group-visible`,
			value: template["GROUP_VISIBLE"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Свободное вступление?',
			type: 'text',
			fieldId: `group-opened`,
			value: template["GROUP_OPENED"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Архивная?',
			type: 'text',
			fieldId: `group-closed`,
			value: template["GROUP_CLOSED"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Проект?',
			type: 'text',
			fieldId: `group-is-project`,
			value: template["GROUP_IS_PROJECT"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Права на добавление пользователей в группу',
			type: 'text',
			fieldId: `group-initiate-perms`,
			value: template["GROUP_INITIATE_PERMS"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Права на отправку сообщений в группу',
			type: 'text',
			fieldId: `group-spam-perms`,
			value: template["GROUP_SPAM_PERMS"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Дата начала проекта',
			type: 'text',
			fieldId: `group-project-start-date`,
			value: template["GROUP_PROJECT_START_DATE"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Дата завершения проекта',
			type: 'text',
			fieldId: `group-project-finish-date`,
			value: template["GROUP_PROJECT_FINISH_DATE"] || "",
		}));

		modalPage.addTaskField();

		modalPage.show();

		
	}
	onDeleteButtonPressed = (event) => {
		let target = event.target || event.srcElement;
		let id = target.parentElement.id || target.id;
		if (confirm(`Вы действительно хотите удалить шаблон с ID: ${id}?`)) {
			sonetTemplates.deleteSonetTemplate(
				id,
				(result) => {
					if(result.error()) {
						console.error ("Ошибка при удалении: " + result.error());
					} else {
						console.log("Удалено успешно: " + result.data());
						this.#sonetTemplates.getSonetTemplates(this.displaySonetTemplates);
					}
				}
			);
		}
		
	}
	onAddButtonPressed = (event) => {
		let highestId = 0;
		Object.keys(this.#sonetTemplatesListLink).forEach(element => {
			if (highestId < element) highestId = element;
		});
		let modalPage = new ItcModal(
			new Object({
				title: `Добавление нового шаблона с ID: ${highestId + 2}`,
				id: Number(highestId) + 2,
				operation: "add",
				footerButtons: new Array(
					new Object({
						class: "button-19",
						text: "Сохранить",
						type: 'submit',
					}),
				)
			})
		);

		modalPage.addLabel(new Object({
			label: 'Название шаблона группы',
			type: 'text',
			fieldId: `template-name`,
			value: '',
		}));

		modalPage.addLabel(new Object({
			label: 'Описание шаблона группы',
			type: 'text',
			fieldId: `template-description`,
			value: '',
		}));

		modalPage.addLabel(new Object({
			label: 'Название группы',
			type: 'text',
			fieldId: `group-name`,
			value: '',
		}));

		modalPage.addLabel(new Object({
			label: 'Описание группы',
			type: 'text',
			fieldId: `group-description`,
			value: '',
		}));

		modalPage.addLabel(new Object({
			label: 'Ключевые слова группы',
			type: 'text',
			fieldId: `group-keywords`,
			value: '',
		}));

		modalPage.addLabel(new Object({
			label: 'Видим в списке групп?',
			type: 'text',
			fieldId: `group-visible`,
			value: '',
		}));

		modalPage.addLabel(new Object({
			label: 'Свободное вступление?',
			type: 'text',
			fieldId: `group-opened`,
			value: '',
		}));

		modalPage.addLabel(new Object({
			label: 'Архивная?',
			type: 'text',
			fieldId: `group-closed`,
			value: '',
		}));

		modalPage.addLabel(new Object({
			label: 'Проект?',
			type: 'text',
			fieldId: `group-is-project`,
			value: '',
		}));

		modalPage.addLabel(new Object({
			label: 'Права на добавление пользователей в группу',
			type: 'text',
			fieldId: `group-initiate-perms`,
			value: '',
		}));

		modalPage.addLabel(new Object({
			label: 'Права на отправку сообщений в группу',
			type: 'text',
			fieldId: `group-spam-perms`,
			value: '',
		}));

		modalPage.addLabel(new Object({
			label: 'Дата начала проекта',
			type: 'text',
			fieldId: `group-project-start-date`,
			value: '',
		}));

		modalPage.addLabel(new Object({
			label: 'Дата завершения проекта',
			type: 'text',
			fieldId: `group-project-finish-date`,
			value: '',
		}));

		modalPage.show();

		//sonetTemplates.addSonetTemplate(event);
	}
	onCreateProjectButtonPressed = (event) => {
		let target = event.target || event.srcElement;
		let id = target.parentElement.id || target.id;
		let template = this.#sonetTemplatesListLink[id];
		this.#sonetTemplates.demap(template);
		if (!template) {
			console.error(`В списке шаблонов не найден Шаблон с ID: ${id}`);
			alert(`В списке шаблонов не найден Шаблон с ID: ${id}`);
			return;
		}
		let modalPage = new ItcModal(
			new Object({
				title: `Конструктор проекта по шаблону: "${template.NAME}" с ID: ${template.ID}`,
				id: id,
				operation: "create",
				footerButtons: new Array(
					new Object({
						class: "button-19",
						text: "Создать проект/группу",
						type: 'submit',
					}),
				)
			})
		);

		modalPage.addLabel(new Object({
			label: 'Название группы',
			type: 'text',
			fieldId: `group-name`,
			value: template["GROUP_NAME"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Описание группы',
			type: 'text',
			fieldId: `group-description`,
			value: template["GROUP_DESCRIPTION"] || "",
		}));

		modalPage.addLabel(new Object({
			label: 'Дата начала задачи',
			type: 'text',
			fieldId: `task-date-start`,
			value: "",
		}));
		modalPage.addLabel(new Object({
			label: 'Дата конца задачи',
			type: 'text',
			fieldId: `task-date-finish`,
			value: "",
		}));


		modalPage.addUserField(new Object({
			label: 'Список пользователей в группе/проекте',
			type: 'text',
			fieldId: `group-list-of-users`,
			value: "",
		}));
		tagsInput = new TagsInput('.tags-input');
		modalPage.show();
	}
	onUpdateButtonPressed() {
		console.log("Updating! :)");
		$('#dimmer').show();
		$('#spinner').show();
		Object.keys(this.#sonetTemplatesListLink).forEach(element => {
			delete this.#sonetTemplatesListLink[element];
		});
		sonetTemplates.getSonetTemplates(sonetApp.displaySonetTemplates);
	}
}
