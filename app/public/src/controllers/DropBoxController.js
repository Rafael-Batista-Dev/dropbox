class DropBoxController {
  constructor() {
    this.btnSendFileEl = document.querySelector("#btn-send-file");
    this.inputFileEl = document.querySelector("#files");
    this.snackModalEl = document.querySelector("#react-snackbar-root");
    this.progressBarEl = this.snackModalEl.querySelector(".mc-progress-bar-fg");
    this.nameFileEl = this.snackModalEl.querySelector(".filename");
    this.timeLeftEl = this.snackModalEl.querySelector(".timeleft");

    //Method para iniciar evento
    this.initEvents();
  }

  initEvents() {
    this.btnSendFileEl.addEventListener("click", (event) => {
      this.inputFileEl.click();
    });

    this.inputFileEl.addEventListener("change", (event) => {
      this.uploadTask(event.target.files);

      this.modalShow();

      this.inputFileEl.value = "";
    });
  }

  //Method mostra e esconder modal
  modalShow(show = true) {
    this.snackModalEl.style.display = show ? "block" : "none";
  }

  uploadTask(files) {
    let promises = [];

    //Usando o spreed para expandir o array
    [...files].forEach((file) => {
      promises.push(
        new Promise((resolve, reject) => {
          let ajax = new XMLHttpRequest();

          ajax.open("POST", "/upload");

          ajax.onload = (event) => {
            this.modalShow(false);

            try {
              resolve(JSON.parse(ajax.responseText));
            } catch (e) {
              reject(e);
            }
          };

          ajax.onerror = (event) => {
            this.modalShow(false);
            reject(event);
          };

          //Retornando os bits enviados e repassando p/ barra de progresso
          ajax.upload.onprogress = (event) => {
            this.uploadProgress(event, file);
          };

          let formData = new FormData();

          formData.append("input-file", file);

          //Pegando o temo do upload
          this.startUploadTime = Date.now();

          ajax.send(formData);
        })
      );
    });
    return Promise.all(promises);
  }

  uploadProgress(event, file) {
    //Pegando a tempo atual e subitraindo pelo o tempo do upload
    let timeSpent = Date.now() - this.startUploadTime;

    let loaded = event.loaded;
    let total = event.total;

    let porcent = parseInt((loaded / total) * 100);

    //calcular a porcentagem restante
    let timeLeft = ((100 - porcent) * timeSpent) / porcent;

    this.progressBarEl.style.width = `${porcent}%`;

    this.nameFileEl.innerHTML = file.name;
    this.timeLeftEl.innerHTML = this.formatTime(timeLeft);
  }

  formatTime(duration) {
    let seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    if (hours > 0)
      return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
    if (minutes > 0) return `${minutes} minutos e ${seconds} segundos`;
    if (seconds > 0) return `${seconds} segundos`;

    return "";
  }
}
