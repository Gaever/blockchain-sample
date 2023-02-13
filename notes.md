### Player

1. Запустить player:server
   `pm2 start process.player.config.js --only player-http`
2. Запустить ctocks
   `pm2 start process.ctocks.config.js`
3. В ctocker/broker добавить конфиг через консоль

```sh
  cd packages/broker && \
  yarn start --config-add /Users/gaever/Documents/chia-stock/packages/player/config/stock_config_max.json && \
  yarn start --config-add /Users/gaever/Documents/chia-stock/packages/player/config/stock_config_ultra.json && \
  yarn start --config-show
  yarn start --config-set-status confirmed --config-id 7
  yarn start --config-set-status confirmed --config-id 8
```

4. В `process.broker.config.js` добавить записи о новых биржах
5. Запустить broker
   `pm2 start process.broker.config.js`
6. Закинуть 2 монеты на главный адрес
7. Отправить этот же конфиг через player:create-stock
   `pm2 start process.player.config.js --only player-create-stock --no-daemon`
8. Подтвердить конфиг через консоль

```sh
  yarn workspace @ctocker/ctocks start --config-show
  yarn workspace @ctocker/ctocks start --config-set-status confirmed --config-id <id>
```

8. Добавить в `process.ctocks.config.js` записи о новых биржах

9. Перезапустить ctocks

```sh
pm2 restart process.ctocks.config.js
```

###

для ротации логов нужно установить
pm2 install pm2-logrotate

### "Тяжелый конфиг"

```sh
  cd packages/broker && \
  yarn start --config-add /Users/gaever/Documents/chia-stock/packages/player/config/stock-config-xch-ach-heavy-1.json && \
  yarn start --config-add /Users/gaever/Documents/chia-stock/packages/player/config/stock-config-xch-ach-heavy-2.json && \
  yarn start --config-add /Users/gaever/Documents/chia-stock/packages/player/config/stock-config-xch-hdd-heavy-1.json && \
  yarn start --config-add /Users/gaever/Documents/chia-stock/packages/player/config/stock-config-xch-hdd-heavy-2.json && \
  yarn start --config-add /Users/gaever/Documents/chia-stock/packages/player/config/stock-config-ach-hdd-heavy-1.json && \
  yarn start --config-add /Users/gaever/Documents/chia-stock/packages/player/config/stock-config-ach-hdd-heavy-2.json && \
  yarn start --config-show
  yarn start --config-set-status confirmed --config-id 3 && \
  yarn start --config-set-status confirmed --config-id 4 && \
  yarn start --config-set-status confirmed --config-id 5 && \
  yarn start --config-set-status confirmed --config-id 6 && \
  yarn start --config-set-status confirmed --config-id 7 && \
  yarn start --config-set-status confirmed --config-id 8
```

- [ ] боевой конфиг
  - добавить комиссию на возврат ордера - 0.1%
  - payout - 0
  - комиссия match - 2%
  - конфиг на возврат 1 неделю
  - минимальная сумма на вход - 10$. все что меньше порога остается на бирже

### TODO

- [ ] Пройтись по логам в роли оператора и скорректировать так чтобы было удобно пользоваться
- [ ] переименовать ctocker в ctoker
- [ ] проверить сохранение конфига через монету

- [x] добавить в логи инфу о текущем сервисе
- [x] формат логов в json
- [x] проверить ротацию логов
- [x] авторестарт
- [x] фронт
- [x] добавить в репорт хэш блока (в инкаи и ауткам)
- [x] поменять проход по bc с block_record_by_hash на block_record (по высоте). Не обрабатывть n блоков до пика
- [x] якно указать кто в какой валюте получает выплату в репорте сделки
      Seller продал Х ach за Y hdd
      Buyer купил A hdd за B ach
      Buyer является taker-ом
- [x] порядок сделка - возврат остатка в report

- [ ] пофиксить отображение просроченного ордера на фронте

### 24.01

- [x] Воспроизвести и исправить отключение клиента от вебсокета

### 22.01

- [x] Рефакторинг тестовой монеты
- [x] Добавить кнопку закрытия всплывающего окна с расчетами
- [x] Синхронизировать поступление данных и отображение символа валюты в стакане при переворачивании валюты
- [x] Рефакторинг калькулятора на фронте

### 21.01

- [x] Рефакторинг функциональных тестов
- [x] Рефакторинг наполнения данными мини-графика

### 30.12

- [x] добавить в интерфейс строку с подродным описанием как расчитывается валюта по курсу
      Send 10 ACH to address below to get 15 HDD by exchange rate ACH/HDD = 0.998
      Your HDD coins will be sent to your HDD address with the same mnemonic as your ACH sender address.
- [x] починить запись rate_puzzle_hash

### 29.12

- [x] поменять текст для подсказки taker / maker
- [x] Правильный пересчет монет в соответствии с количеством mojo в монете
- [x] отдебажить сохранение ссылки в монету с конфигом

### 28.12

- [x] ожидать пока тестовая монета подтвердится
- [x] логи с т.з. UX оператора
- [x] прыгает обновление при переворачивании валюты
- [x] шрифт пдфки в контейнере
- [x] изменить title
- [x] скрипт мониторинга pm2 + ansible
- [x] добавить авторестарты в pm2
- [x] сохранять высоту в income
- [x] монета-мониторинг

### 27.12

- [x] убрать key_storage из базы, генерить spk на лету
- [x] регулярку на символы в цене (только цифры)
- [x] подписать sell and buy
- [x] прятать qr и адрес при неправльном адресе

- [x] refund fee округляется в ноль на фронте, должен округляться в 1
- [x] diff % сделать отрицательной
- [x] diff -> change
- [x] подписать валюту на главной странице

### 26.12

- [x] добавить пустые промежутки на временном графике на странице списка бирж
- [x] добавить пустые промежутки на временном графике

### 25.12

- [x] создать несколько временных рядов для каждой биржи, на 1 мин, 1ч, 1д, 1нед
- [x] записывать / обновлять сделку в каждый временной ряд

### 24.12

- [x] заменить среднюю цену на последнюю сгруппированную
- [x] стакан не окрашивается если цена на продажу выше равновесной
- [x] стакан некорректно окрашывается при протухании ордера

### 22.02

- [x] скрыть скролл цены на телефона, заменить его на кнопки увеличить / уменьшить
- [x] добавить скелетон в дровер для текста

### 21.02

- [x] разместить инфраструктуру на малевиче

  - [x] ctoker_xch
  - [x] ctoker_ach
  - [x] ctoker_hdd
  - [x] ctoker_match_1
  - [x] ctoker_match_2
  - [x] ctoker_aggr_ach
  - [x] ctoker_aggr_hdd
  - [x] ctoker_aggr_xch
  - [x] ctoker_aggr_match_1
  - [x] ctoker_aggr_match_2
  - [x] ctoker_web_api

### 20.02

- [x] неправильно переворачивается валюта в стакане
- [x] темная тема
- [x] уровни логирования
- [x] сделать кэш key storage

### 19.02

- [x] стресс-тест на тяжелых конфигах

  - [x] создать биржи: 2xXCH -> ACH, 2xACH->HDD, 2xXCH -> HD

- [x] пофиксить непонятную багу при создании монеты
- [x] PDF с правилами
- [x] утилита для ручной установки высоты
- [x] точность на странице со списком бирж
- [x] артефакты верстки при изменения группировки (проверить)
- [x] упрощенный запуск pm2
- [x] добавить get_network_info
- [x] проверка на префикс у stock_holder_address
- [x] broker/payout должен читать все stock-config
- [x] дать выбирать из какого блокчейна читать конфиг
- [x] добавить в collector параметр какой блокчейн запускать

### 16.12

- [x] неправильно считается объем при группировке
- [-] остановить группировку, если отображаются границы ценника (отдельно верх, отдельно низ)
- [x] пофиксить пересчет курса в стакане на фронте
- [x] amount in undefined на мобильной верстке
- [x] переренсти кнопки управления наверх
- [x] 10 значащих цифр
- [x] подписать валюту возле равновесной цены

### 14.12

- [x] бот, играющий на бирже (бот-игрок, @ctocker/player) (продолжение)
- [x] переименовать glassConfig в exchangeConfig
- [x] разный порядок монет для разных форков
- [x] добавить минимальную сумму в pdf
- [ ] стресс-тест на тяжелых конфигах

  - [ ] создать биржи: 2xXCH -> ACH, 2xACH->HDD, 2xXCH -> HD
  - [x] создать 4x15000 (60 000) адресов в xch
  - [x] создать 4x15000 (60 000) адресов в ach
  - [x] создать 4x15000 (60 000) адресов в hdd
  - [x] запустить бота-игрока

### 11.12 - 13.12

- [x] бот, играющий на бирже (бот-игрок, @ctocker/player)

  - [x] выбрать стартовые клиентские адреса
  - [x] проверить количество денег на них
  - [x] восполнить, если денег нет
  - [x] отправить произвольную сумму на произвольный адрес биржи
  - [x] вести таблицу-лог с его действиями
    - id
    - tx_id отправленной монеты
    - количество монет на адресе на момент отправки на стартовом блокчейне
    - количество монет на адресе целевого блокчейна на момент отправки
    - количество отправленых монет со стартового блокчейна
    - на какой блокчейн отправляем
    - количество отправленных монет
    - ожидаемое количество монет на адресе в целевом блокчейне
    - реальное количество монет на адресе в целевом блокчейне (после того как все операции прошли, либо отвалились по таймауту)
    - ожидаемое количество монет на комиссионном адресе после выполнения биржевой транзакции
    - реальное количество монет на комиссионном адресе после выполнения биржевой транзакции
    - статус: created | pending-stock | success | mismatch

### 10.12

- [x] систематезировать debug константы и логи
- [x] рефакторинг гипервизора
- [x] добавить hdd
  - [x] прописать в fullnodeEnviroment
  - [x] добавить автотест на создание монеты
  - [x] добавить e2e автотест
  - [x] добавить e2e автотест с комиссией блокчейна

### 09.12

- [x] скалирование стакана
- [x] отобразить поля со всеми комиссиями и расчетным значением при переводе
- [x] минимальная сумма оплаты
- [x] добавить комиссию за возврат

### 08.12

- [x] отдебажить отображение объема и порядка цены в стакане
- [x] перевернуть рейты в виджете выбора адреса при смене базового символа
- [x] переименовить bcFee в transactionFee

### 07.12

- [x] отдебажить сохранение временного ряда
- [x] показать все рейты в стакане
- [x] переделать график на тертий столбец
- [x] показывать стакан если нет сделок

### реальность

### 05.12

- [x] консольная утилита для добавления и подтверждения нового конфига
- [x] добавить параметр в конфиг с какой высоты применять конфиг
- [x] проверить "кривые" цифры в отображении графика
- [x] разрядность отображаемых сумм
- [x] страница со списком адресов
- [x] переключение отображения в обратную валюту
- [x] запоминать выбранный временной интервал

### 04.12

- [x] разделить фронт на CRA и бэкенд
- [x] корректно отображать цену последней сделки
- [x] отобразить суточный график цены на списке бирж

### 03.12

- [x] проверить ордер без срока жизни
- [x] сделать проверку на пересечение адресов в конфигах при добавлнии нового
- [x] добавить тест с комиссией блокчейна
- [x] тест для комиссии в mojo
- [x] добавить в автотест стакана граничные условия конфига с "плохими" числами
- [x] добавить в автотест стакана граничные условия конфига с "плохими" числами
- [x] не отображать в стакане сделки которые невозможно выплатить после всех комиссий
  - _ничего не надо делать. broker пометит ордер и сделку выполненными и просто не произведет выплату.\
    ctocks вообще не узнает что выплата не была произведена \
    (он не может симулировать создание выплаты с таким же transaction_id и, следовательно, \
    не может однозначно связать созданный outcome с найденной в блокчйне outTx)_

### 02.12

- [x] переделать тип коэффициентов в curSeriesModel с nubmer в строки
- [x] переделать тип коэффициентов в конфигах с nubmer в строки
- [x] протестировать обратную выплату просроченного ордера

### 01.12

- [x] адаптивная верстка
- [x] в компонент выбора адреса передавать только список рейтов без адресов, адрес запрашивать по api
- [x] поддержвать рукописный ввод коэффциента

### 30.11

- [x] оформить минимальный дизайн для страницы со списком бирж
- [x] агрегировать объем стакана (третий столбец)
- [x] добавить в автотест условие по очистке кэша монет
- [x] расследовать, почему не нашлась монета сдачи и не освободила кэш монет

### 29.11

- [x] имитировать добавление данных в реальном времени
- [x] отдебажить build скрипты
- [x] отображать время на графике в часовом поясе клиента
- [x] интерфейс выбора адреса по ставке

### 28.11

- [x] отдебажить дублирование ордеров

### 26.11

- [x] разделить приложение по процессам
- [x] покрыть интеграционным тестом работу бота-агрегатора
- [x] переписать автотесты под разделенные процессы

### 25.11

- [x] провести реальную транзацию с отображением ее на гарфик

### 24.11

- [x] mock данные для бота-агрегатора
- [x] дебаг и покрытие тестами фронтового вебсокета
- [x] отобразить стакан
- [x] дорисовать отображение стакана (есть ряд косяков)
- [x] масштабирование графика объема
- [x] скрывать всплывающее меню после выбора элемента списка
- [x] починить поминутное отображение
- [x] форматирование больших и маленьких сумм на фронте
- [x] дебаг переключения между биржами и временными интервалами
- [x] дебаг списка бирж

# Перспектива

- [ ] версионирование конфига
  - [ ] привязка конфига к puzzle_hash
  - [ ] начало действия конфига с указанной в нем высоты
- [ ] валидация обновленного конфига по puzzle_hash
- [ ] решить проблему большого количества монет на адресе. Апишка может захлебнуться
  - [ ] вести независимый кэш монет в базе
- [ ] сделать collector масштабируемым. По мере роста количества адресов с конфигами приложение будет есть память
- [ ] запрос на возврат - закинуть 1 mojo чтобы вернуть все
- [ ] на что влияет MAX COST?

# Отправить деньги в ACH

POSTGRES="postgres://ctocker:password@localhost:15432/ctocker_broker" \
CUR="ach" \
FULLNODE_URI="https://localhost:19965" \
SSL_CERT_PATH="/Users/gaever/Documents/chia-stock/certs/ACH_SSL_CERT.crt" \
SSL_KEY_PATH="/Users/gaever/Documents/chia-stock/certs/ACH_SSL_CERT.key" \
yarn dev \
 --tx-cur ach \
 --tx-from ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna \
 --tx-to ach1tllx266jeqz625alqj2dldntmperpzpgd2jeqgfntf2u2vk2xqfq6j0nt2 \
 --tx-amount 15 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

# Отправить деньги в HDD

POSTGRES="postgres://ctocker:password@localhost:15432/ctocker_broker" \
CUR="hdd" \
FULLNODE_URI="https://localhost:28555" \
SSL_CERT_PATH="/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.crt" \
SSL_KEY_PATH="/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.key" \
yarn dev \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd1cn82gvksvq36h0lqy9k0t6jth4qukghp4djzsn9ymyfk2qs8df7s6cp0zl \
 --tx-amount 15000 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

# отправить конфиг в HDD

POSTGRES="postgres://ctocker:password@localhost:15432/ctocker_broker" \
CUR="hdd" \
FULLNODE_URI="https://localhost:28555" \
SSL_CERT_PATH="/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.crt" \
SSL_KEY_PATH="/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.key" \
yarn dev \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd1arexn7zcus7axqs25ydzpyfdq4qz5jpeqapt6knjzq56fdpt7x3s4pfnw6 \
 --tx-amount 1 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a \
 --tx-stock-config-url=https://file.io/A1PDhMfmajMY

; ach collect
POSTGRES="postgres://ctocker:password@localhost:15432/ctocker_broker" \
CUR="ach" \
FULLNODE_URI="https://localhost:19965" \
SSL_CERT_PATH="/Users/gaever/Documents/chia-stock/certs/ACH_SSL_CERT.crt" \
SSL_KEY_PATH="/Users/gaever/Documents/chia-stock/certs/ACH_SSL_CERT.key" \
STOCK_HOLDER_ADDRESS="ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna" \
LOG_LEVEL="debug" \
yarn dev --service=collect

; ach payout
POSTGRES=postgres://ctocker:password@localhost:15432/ctocker_broker \
CUR=ach \
FULLNODE_URI=https://localhost:19965 \
SSL_CERT_PATH=/Users/gaever/Documents/chia-stock/certs/ACH_SSL_CERT.crt \
SSL_KEY_PATH=/Users/gaever/Documents/chia-stock/certs/ACH_SSL_CERT.key \
KEY_STORAGE_PATH="/Users/gaever/Documents/chia-stock/packages/broker/config/ach_heavy_2_keychain.json /Users/gaever/Documents/chia-stock/packages/broker/config/ach_heavy_3_keychain.json" \
LOG_LEVEL=debug \
yarn dev --service=payout

; hdd collect
POSTGRES="postgres://ctocker:password@localhost:15432/ctocker_broker" \
CUR="hdd" \
FULLNODE_URI="https://localhost:28555" \
SSL_CERT_PATH="/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.crt" \
SSL_KEY_PATH="/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.key" \
STOCK_HOLDER_ADDRESS="hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0" \
LOG_LEVEL="debug" \
yarn dev --service=collect

; hdd payout
POSTGRES=postgres://ctocker:password@localhost:15432/ctocker_broker \
CUR=hdd \
FULLNODE_URI=https://localhost:28555 \
SSL_CERT_PATH=/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.crt \
SSL_KEY_PATH=/Users/gaever/Documents/chia-stock/certs/HDD_SSL_CERT.key \
KEY_STORAGE_PATH="/Users/gaever/Documents/chia-stock/packages/broker/config/hdd_heavy_4_keychain.json" \
LOG_LEVEL=debug \
yarn dev --service=payout

; ach-hdd match
POSTGRES=postgres://ctocker:password@localhost:15432/ctocker_broker \
STOCK_CONFIG_ID=10 \
CUR1_STOCK_HOLDER_ADDRESS=ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna \
CUR2_STOCK_HOLDER_ADDRESS=hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
LOG_LEVEL=debug \
yarn dev --service=match

POSTGRES="postgres://ctocker:password@localhost:15432/ctocker_broker" \
CUR="ach" \
FULLNODE_URI="https://localhost:19965" \
SSL_CERT_PATH="/Users/gaever/Documents/chia-stock/certs/ACH_SSL_CERT.crt" \
SSL_KEY_PATH="/Users/gaever/Documents/chia-stock/certs/ACH_SSL_CERT.key" \
STOCK_HOLDER_ADDRESS="ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna" \
LOG_LEVEL="debug" \
yarn dev --tx-test

<!-- rate 1  -->

yarn start \
 --tx-cur ach \
 --tx-from ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna \
 --tx-to ach1tllx266jeqz625alqj2dldntmperpzpgd2jeqgfntf2u2vk2xqfq6j0nt2 \
 --tx-amount 10 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

<!-- rate 1  -->

yarn start \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd1cn82gvksvq36h0lqy9k0t6jth4qukghp4djzsn9ymyfk2qs8df7s6cp0zl \
 --tx-amount 10000 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

<!-- 1.001 -->

yarn start \
 --tx-cur ach \
 --tx-from ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna \
 --tx-to ach1wd4j6wtxxspa88tk5vh6u9uvtjeaujxqnknj6t3ses0y7m0zj4dqyyzxql \
 --tx-amount 10 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

<!-- 0.999 0.000010000 -->

yarn start \
 --tx-cur ach \
 --tx-from ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna \
 --tx-to ach1ysexx4flrvm8x94gchnskqxqqggsx4hlpxw9u7adpak7mlqz4zjqksk67l \
 --tx-amount 10000 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

<!-- 0.998 0.000010000 -->

yarn start \
 --tx-cur ach \
 --tx-from ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna \
 --tx-to ach1f4894xamf4xuy9j8022m0l26cw5dhax35j7tf3qm6am9j4x7gteqnf2gw8 \
 --tx-amount 10000 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

<!-- 0.997 0.000010000 ach -->

yarn start \
 --tx-cur ach \
 --tx-from ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna \
 --tx-to ach17t4mrpmh5srsm23vsgjwmdn9kya8axgz678hkuag3vcr0jtdy9kqpcy7e0 \
 --tx-amount 101 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

<!-- 0.995  -->

yarn start \
 --tx-cur ach \
 --tx-from ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna \
 --tx-to ach1uwzzt5kvwemglgfpfv5hdkytmun79jlkwlhy3dj4yqkq4mx04l2sc370ff \
 --tx-amount 300 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

<!-- 0.994  -->

yarn start \
 --tx-cur ach \
 --tx-from ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna \
 --tx-to ach1f9xtz0mt9fqg00u8fxlxr8nh4emsc69f8anccdmfd4uhulv9v9eq5cktms \
 --tx-amount 1000 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

0.000009062730

<!-- 0.997 9062730 hdd -->

yarn start \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd1ct82k5rudqjn4m5etfuxs5lqlthgr2h4ydqz6wcruk202x33egyqwrmag9 \
 --tx-amount 9062730 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

<!-- 0.997 -->

yarn start \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd1wk92zm4zhansrsk9znpusfmglfva9supay2plcpa45jzkkpujhjqt24f60 \
 --tx-amount 100000 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

<!-- 0.997 -->

yarn start \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd1ct82k5rudqjn4m5etfuxs5lqlthgr2h4ydqz6wcruk202x33egyqwrmag9 \
 --tx-amount 100000 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

<!-- 0.996 -->

yarn start \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd1ah77ms8eg6qmcx2hfa4uya6shlr3jzxq2vvcnxtfd6dy85j8xvcqrvx6hm \
 --tx-amount 100000 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

<!-- 0.995 -->

yarn start \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd1pe8pttrtcnt0yauved9duu2pjxxxajp2460vvm26uacpprusfxrqlvfsay \
 --tx-amount 100000 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

<!-- 0.994 -->

yarn start \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd12h60fxw7sxhsdse3y8ks30glsn339rr3axmu0gsqt9ue3un2k6ks8up8g8 \
 --tx-amount 20000000 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

yarn start \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd1u9l8gykzqsgjp02a0ul7xc5fh9348c6j4uslljl9tnpsgyqehy3qqdnsc4 \
 --tx-amount 10000 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

yarn start \
 --tx-cur ach \
 --tx-from ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna \
 --tx-to ach1a9k8j08pfdh69dlve03g03kjrk536aj3ke5tujjmdvfhkhjyqjxqju7n0m \
 --tx-amount 10 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

yarn start \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd1qne93efa4czgwwl70ll7rme2s7hf4elj2gdvymvhf6rvrzpzhcyq02fv7l \
 --tx-amount 15 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a

yarn start \
 --tx-cur hdd \
 --tx-from hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0 \
 --tx-to hdd1lr6jwku0udpz4y2ezhydx7mu3mdz6nxxka0k73z36yh6ym5urs4qjvp23s \
 --tx-amount 10000 \
 --tx-sk 0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948 \
 --tx-pk 9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a
