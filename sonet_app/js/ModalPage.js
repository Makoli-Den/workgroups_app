class ItcModal {
    #elem;
    #baseTemplate = `
	<div class="itc-modal-backdrop">
		<div class="itc-modal-content">
			<div class="itc-modal-header">
				<div class="itc-modal-title">{{title}}</div>
				<span class="itc-modal-btn-close" title="Закрыть">×</span>
			</div>
			<div class="itc-modal-body">{{content}}</div>
			{{footer}}
		</div>
	</div>
    `;
    #templateFooter = '<div class="itc-modal-footer">{{buttons}}</div>';
    #templateBtn = '<button type="{{type}}" class="{{class}}" data-action="save">{{text}}</button>';
    #templateLabel = `
		<label for="{{fieldId}}" class="inp">
			<input type="{{type}}" id="{{fieldId}}" name="{{fieldId}}" placeholder="&nbsp;" value="{{value}}">
				<span class="label">{{label}}</span>
			<span class="focus-bg"></span>
		</label>
    `;
	#templateUserField = `
		<div class="tags-input"></div>
	`;
	#templateUser = `<div id="{{id}}" class="user-smth" onclick="adduserintofield(event)">{{user}}</div>`;
	#templateTaskField = `
		<div id="tasks-field" class="autocomplete">
			<input type="text" id="tasks-field-input" class="autocomplete-input" placeholder="Список задач">
			<div id="tasks-field-results" class="autocomplete-results">
				<div id="tasks-field-results-add" class="autocomplete-add-task">
					<span class="autocomplete-result-name">Добавить задачу</span>
				</div>
			</div>
		</div>
	`;
    #eventShowModal = new Event('show.itc.modal', { bubbles: true });
    #eventHideModal = new Event('hide.itc.modal', { bubbles: true });
    #disposed = false;

    constructor(options = []) {
		this.#elem = document.createElement('form');
		this.#elem.classList.add('itc-modal');
		this.#elem.id = `${options.operation}-template-${options.id}`;
		let html = this.#baseTemplate.replace('{{title}}', options.title || 'Новое окно');
		html = html.replace('{{content}}', options.content || '');
		const buttons = (options.footerButtons || []).map((item) => {
			let btn = this.#templateBtn.replace('{{class}}', item.class);
			btn = btn.replace('{{type}}', item.type);
			return btn.replace('{{text}}', item.text);
		});
		const footer = buttons.length ? this.#templateFooter.replace('{{buttons}}', buttons.join('')) : '';
		html = html.replace('{{footer}}', footer);
		this.#elem.innerHTML = html;
		document.body.append(this.#elem);
		this.#elem.addEventListener('click', this.#handlerCloseModal.bind(this));
		this.#elem.addEventListener('submit', this.#handlerSave.bind(this));
	}

	#handlerCloseModal(e) {
		if (e.target.closest('.itc-modal-btn-close') || e.target.classList.contains('itc-modal-backdrop')) {
			Object.keys(selectedUsersList).forEach(element => {
				delete selectedUsersList[element];
			});
			this.dispose();
		}
	}
	#handlerSave(e) {
		e.preventDefault();
		let data = new FormData(this.#elem);
		let operation = this.#elem.id.split("-template-")[0];
		let id = this.#elem.id.split("-template-")[1];
		if (operation == "add") {
			sonetTemplates.addSonetTemplate(data, id, this);
		} else if (operation == "edit") {
			let i = 0;
			Object.keys(tempTaskList).forEach(element => {
				i++;
			});
			if (i == 0) {
				sonetTemplates.editSonetTemplate(data, id, this);
			} else {
				sonetTemplates.createTaskInTemplate(data, id, this);
			}
		} else if (operation == "create") {
			let dateStart = new Date(data.get("task-date-start"));
			let dateFinish = new Date(data.get("task-date-finish"));

			sonetTemplates.createSonetByTemplate(data, id, this, dateStart, dateFinish);
		} else if (operation == "tasks-modal-page") {
			tempTaskList[data.get("task-name")] = {"task-desc": data.get("task-desc")};
			document.querySelector('#tasks-field-input').value += `${data.get("task-name")}|`;
			document.querySelector('#tasks-field-input').textContent += `${data.get("task-name")}|`;
			this.dispose();
		}
	}

	show() {
		if (this.#disposed) {
			return;
		}
		this.#elem.classList.add('itc-modal-show');
		this.#elem.dispatchEvent(this.#eventShowModal);
	}

	hide() {
		this.#elem.classList.remove('itc-modal-show');
		this.#elem.dispatchEvent(this.#eventHideModal);
	}

	dispose() {
		if (!this.#elem.id.includes("users-modal")) {
			Object.keys(selectedUsersList).forEach(element => {
				delete selectedUsersList[element];
			});
			Object.keys(tempTaskList).forEach(element => {
				delete tempTaskList[element];
			});
		}
		this.#elem.remove(this.#elem);
		this.#elem.removeEventListener('click', this.#handlerCloseModal);
		this.#disposed = true;
	}

	setBody(html) {
		this.#elem.querySelector('.itc-modal-body').innerHTML = html;
	}

	setTitle(text) {
		this.#elem.querySelector('.itc-modal-title').innerHTML = text;
	}

	addLabel(options = []) {
		let html = this.#templateLabel;
		Object.keys(options).forEach(element => {
			html = html.replaceAll(`{{${element}}}`, options[element]);
		});
		this.#elem.querySelector('.itc-modal-body').innerHTML += html;
	}
	addUserField(options = []) {
		let html = this.#templateUserField;
		this.#elem.querySelector('.itc-modal-body').innerHTML += html;
	}
	addTaskField(options = []) {
		let html = this.#templateTaskField;
		this.#elem.querySelector('.itc-modal-body').innerHTML += html;
		
		var autocomplete = this.#elem.querySelector('#tasks-field');
		console.log(autocomplete);
		var input = autocomplete.querySelector('#tasks-field-input');
		console.log(input);
		var resultsContainer = autocomplete.querySelector('#tasks-field-results');
		console.log(resultsContainer);
		var resultsAdd = autocomplete.querySelector('#tasks-field-results-add');
		console.log(resultsAdd);
		var resultsList = autocomplete.querySelectorAll('#tasks-field-result');
		console.log(resultsList);

		input.addEventListener('input', () => {
			resultsContainer.classList.add('active');
			
		});

		input.addEventListener('keydown', (event) => {	
			if (event.keyCode == 8) {
				console.log(event);
				let valueArray = document.querySelector('#tasks-field-input').value.split("|");
				let resString = '';
				if (valueArray[valueArray.length - 1] == "") {
					let elToDelete = valueArray[valueArray.length - 2];
					delete tempTaskList[elToDelete];
					valueArray.pop();
					valueArray.pop();
				} else {
					let elToDelete = valueArray[valueArray.length - 1];
					delete tempTaskList[elToDelete];
					valueArray.pop();
				}
				valueArray.forEach(element => {
					resString += `${element}|`;
				});
				document.querySelector('#tasks-field-input').value = resString;
				document.querySelector('#tasks-field-input').textContent = resString;
			}
		});
		  
		input.addEventListener('focus', () => {
			resultsContainer.classList.add('active');
		});
		  
		input.addEventListener('blur', () => {
			resultsContainer.classList.remove('active');
		});

		resultsAdd.addEventListener('click', (event) => {
			let id = this.#elem.id.split("-template-")[1];
			let modalPage = new ItcModal(
				new Object({
					title: `Добавление новой задачи`,
					id: id + "users-modal",
					operation: "tasks-modal-page",
					footerButtons: new Array(
						new Object({
							class: "button-19",
							text: "Сохранить задачу в шаблон",
							type: 'submit',
						}),
					)
				})
			);
	
			modalPage.addLabel(new Object({
				label: 'Название задачи',
				type: 'text',
				fieldId: `task-name`,
				value: '',
			}));

			modalPage.addLabel(new Object({
				label: 'Описание задачи',
				type: 'text',
				fieldId: `task-desc`,
				value: '',
			}));

			modalPage.show();
		});
	}
	addUser(options = []) {
		let html = this.#templateUser;
		Object.keys(options).forEach(element => {
			html = html.replaceAll(`{{${element}}}`, options[element]);
		});
		this.#elem.querySelector('.itc-modal-body').innerHTML += html;
	}
}
	