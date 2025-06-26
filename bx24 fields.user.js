// ==UserScript==
// @name         Bitrix24 Field Modifier
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Добавляет data-cid к заголовкам полей в Bitrix24
// @author       You
// @match        https://*.bitrix24.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitrix24.ru
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Функция для преобразования data-cid в читаемый формат
    function formatDataCid(dataCid) {
        // Если есть разделители _
        if (dataCid.includes('_')) {
            let parts = dataCid.split('_');
            let result = parts.map(part => {
                if (part.length === 0) return '';
                return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            }).join('');
            return result;
        } else {
            // Если нет разделителей _ - первая буква заглавная, остальные строчные
            return dataCid.charAt(0).toUpperCase() + dataCid.slice(1).toLowerCase();
        }
    }

    // Функция для копирования в буфер обмена
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            console.log('Скопировано в буфер обмена: ' + text);
        }).catch(function(err) {
            console.error('Ошибка копирования: ', err);
        });
    }

    // Функция для обработки элементов
    function processElements() {
        // Находим все элементы с нужным классом и data-cid
        const elements = document.querySelectorAll('.ui-entity-editor-content-block[data-cid]');

        elements.forEach(element => {
            const dataCid = element.getAttribute('data-cid');
            const labelElement = element.querySelector('.ui-entity-editor-block-title-text');

            if (dataCid && labelElement) {
                // Проверяем, не добавили ли мы уже data-cid к этому элементу
                const currentText = labelElement.textContent;
                const formattedCid = formatDataCid(dataCid);

                // Если data-cid еще не добавлен (проверяем наличие фигурных скобок)
                if (!currentText.includes('{') && !currentText.includes('}')) {
                    // Сохраняем оригинальный текст
                    const originalText = currentText;

                    // Проверяем, есть ли 'company' в URL
                    const shouldAddMyCompany = window.location.href.toLowerCase().includes('company');
                    const copyText = shouldAddMyCompany ? `{MyCompany${formattedCid}}` : `{${formattedCid}}`;

                    // Очищаем содержимое и создаем новую структуру
                    labelElement.innerHTML = '';

                    // Создаем span для основного текста
                    const mainTextSpan = document.createElement('span');
                    mainTextSpan.innerHTML = originalText + '&nbsp;';
                    mainTextSpan.style.cursor = 'default';

                    // Создаем span для текста в фигурных скобках
                    const cidSpan = document.createElement('span');
                    cidSpan.textContent = copyText;
                    cidSpan.style.cursor = 'pointer';
                    cidSpan.title = 'Нажмите для копирования: ' + copyText;

                    // Добавляем обработчик клика только для span с data-cid
                    cidSpan.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        copyToClipboard(copyText);

                        // Визуальная обратная связь
                        const originalColor = cidSpan.style.color;
                        cidSpan.style.color = '#28a745';
                        setTimeout(() => {
                            cidSpan.style.color = originalColor;
                        }, 500);
                    });

                    // Добавляем все элементы в labelElement
                    labelElement.appendChild(mainTextSpan);
                    labelElement.appendChild(cidSpan);

                    // Убираем стили курсора с родительского элемента
                    labelElement.style.cursor = 'default';
                }
            }
        });
    }

    // Обработка при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processElements);
    } else {
        processElements();
    }

    // Обработка динамически добавляемых элементов
    const observer = new MutationObserver(function(mutations) {
        let shouldProcess = false;

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Проверяем, добавился ли элемент с нужным классом
                        if (node.classList && node.classList.contains('ui-entity-editor-content-block') && node.hasAttribute('data-cid')) {
                            shouldProcess = true;
                        }
                        // Или если внутри добавленного элемента есть нужные элементы
                        if (node.querySelector && node.querySelector('.ui-entity-editor-content-block[data-cid]')) {
                            shouldProcess = true;
                        }
                    }
                });
            }
        });

        if (shouldProcess) {
            // Небольшая задержка для завершения рендеринга
            setTimeout(processElements, 100);
        }
    });

    // Начинаем наблюдение за изменениями в DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Дополнительная обработка через интервалы (на случай если MutationObserver пропустит изменения)
    setInterval(processElements, 2000);

})();
