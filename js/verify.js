$(document).ready(function () {
    getDataVerify();

    // Get Verify Info
    function getDataVerify() {
        var url_params = new URLSearchParams(window.location.search);
        if (url_params.has('client') && url_params.has('course')) {
            var id_client = url_params.get('client');
            var id_course = url_params.get('course');
            $.getScript('js/global.js', function () {
                $.ajax({
                    type: "POST",
                    url: _global.server_url + 'web/web.php',
                    data: "web_action=verifyQR&id_client=" + id_client + "&id_course=" + id_course,
                    dataType: "json",
                    success: function (response) {
                        setQRDAta(response);
                    }, error: function (error) {
                        console.error(error);
                    }
                });
            });
        } else {
            $('#qr-info').html(`
                <div class="icon text-center">
                    <i class="icofont-error qtext-danger h1"></i>
                    <h4 class="mb-2 h2 text-center"> Error en la verificación de QR </h4>
                    <p>El QR escaneado no es válido o no está registrado en Quimeras Bolivia</p>
                </div>
            `);
        }
    }

    // Set Data from QR
    function setQRDAta(qr_data) {
        if (qr_data != null) {
            $.getScript('js/global.js', function () {
                var themes_label = ``;
                qr_data.themes.forEach(theme => {
                    themes_label += `
                        <a href="${theme.link}" class="btn btn-rounded bg-secondary text-light p-0 pl-2 pr-2 mt-2 mr-1 link-course-video btn-add-item" target="_blank">
                            ${theme.theme}
                        </a>
                    `;
                });
                // Calculate CMQ id
                var id_generated = '';
                switch (qr_data.id_client.length) {
                    case 1: id_generated += "000" + qr_data.id_client.toString(); break;
                    case 2: id_generated += "00" + qr_data.id_client.toString(); break;
                    case 3: id_generated += "0" + qr_data.id_client.toString(); break;
                    case 4: id_generated += qr_data.id_client.toString(); break;
                    default: id_generated += qr_data.id_client.toString(); break;
                }

                var copyright_text = '';
                if (qr_data.company == 'Quimeras') {
                    copyright_text = 'El presente certificado se otorga bajo registro en el Servicio Plurinacional de Registro de Comercio – SEPREC, en concordancia con el D.S. 4596, también con registro en el Servicio de Impuestos Nacionales de Bolivia con Número de Identificación Tributaria y Matrícula de Comercio N° 6600800010, con actividad principal 854000 - Enseñanza de adultos y otros tipos de enseñanza en concordancia con las normas tributarias en vigencia y en cumplimiento a las normas establecidas en el Código de Comercio.';
                }
                if (qr_data.company == 'Icarus') {
                    copyright_text = 'El presente certificado se otorga bajo registro en el Servicio Plurinacional de Registro de Comercio – SEPREC, en concordancia con el D.S. 4596, también con registro en el Servicio de Impuestos Nacionales de Bolivia con Número de Identificación Tributaria y Matrícula de Comercio N° 6120604016, con actividad principal 854000 - Enseñanza de adultos y otros tipos de enseñanza en concordancia con las normas tributarias en vigencia y en cumplimiento a las normas establecidas en el Código de Comercio.';
                }
                if (qr_data.company == 'Ambos') {
                    copyright_text = 'El presente certificado se otorga bajo registro en el Servicio Plurinacional de Registro de Comercio – SEPREC, en concordancia con el D.S. 4596, también con registro en el Servicio de Impuestos Nacionales de Bolivia con Número de Identificación Tributaria y Matricula de Comercio N° 6600800010 Consultora Multidisciplinaria QUIMERAS, N° 6120604016 - ICARUS Consultores, con actividad principal 854000 - Enseñanza de adultos y otros tipos de enseñanza en concordancia con las normas tributarias en vigencia y en cumplimiento a las normas establecidas en el Código de Comercio.';
                }

                var content_label = `
                    <div class="icon text-center">
                        <i class="icofont-check qtext-success h1"></i>
                        <h4 class="mb-2 h2 text-center"> Verificación exitosa de QR </h4>
                    </div>
                    <p class="text-center">Felicidades <span class="font-weight-bold">${qr_data.client_name}</span>, su certificado es totalmente válido, es original y ha sido verficado correctamente. </p>
                    <div class="row justify-content-center">
                        <article class="col-lg-6 mb-2 mt-1">
                            <h5 class="mb-1">${qr_data.title_course}</h5>
                            <p class="text-muted mb-2">${qr_data.description}</p>
                            <div class="media img-block mb-lg-0">
                                <img src="${_global.server_url + 'assets/img/courses/' + qr_data.image}" class="img-fluid rounded mr-2 mb-2">
                                <div class="media-body">
                                    <p class="qtext-primary mb-0"><i class="fa fa-user mr-1"></i> ${'CMQ_' + id_generated} </p>
                                    <p class="qtext-primary mb-0"><i class="fa fa-graduation-cap mr-1"></i> ${qr_data.realization_date} </p>
                                    <p class="d-flex justify-content-space-around mb-2">
                                        ${themes_label}
                                    </p>
                                </div>
                            </div>
                        </article>
                        <p class="p-3 copyright-form">${copyright_text}</p>
                    </div>
                `;
                $('#qr-info').html(content_label);
            });
        } else {
            $('#qr-info').html(`
                <div class="icon text-center">
                    <i class="icofont-error qtext-danger h1"></i>
                    <h4 class="mb-2 h2 text-center"> Error en la verificación de QR </h4>
                    <p>El QR escaneado no es válido o no está registrado en Quimeras Bolivia</p>
                </div>
            `);
        }
    }
});