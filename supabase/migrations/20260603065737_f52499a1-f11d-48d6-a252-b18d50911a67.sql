UPDATE blog_posts 
SET body_lv = E'## Kāpēc RTK GNSS?

RTK (Real-Time Kinematic) GNSS tehnoloģija nodrošina centimetru līmeņa precizitāti reālajā laikā. Salīdzinājumā ar standarta GNSS uztvērējiem, kas sniedz metros precīzus datus, RTK sistēmas izmanto bāzes staciju vai virtuālo referenčo staciju tīklu (VRS), lai koriģētu signāla kļūdas.

## Galvenie izvēles kritēriji

### 1. Precizitātes prasības

- **Topogrāfiskie mērījumi**: 1–2 cm horizontāli, 2–3 cm vertikāli
- **Inženierbūves**: 1 cm vai labāk
- **Zemes kadastrī**: atkarībā no valsts regulām

### 2. IP aizsardzības klase

Darbs lietainos vai putekļainos apstākļos prasa vismaz **IP65** aizsardzību. Daži ražotāji, piemēram, Satlab, piedāvā pat IP67.

### 3. Baterijas darbības laiks

Ieteicams vismaz 8 stundu nepārtraukts darbs. Daži modeļi, piemēram, Satlab SL900, nodrošina līdz pat 12 stundām ar vienu uzlādi.

### 4. IMU tehnoloģija

Inerce Measurement Unit (IMU) ļauj mērīt ar slīpu stieni, ietaupot laiku un samazinot fizisko slodzi.

## Secinājums

Izvēloties GNSS uztvērēju, vispirms definējiet savas precizitātes prasības un darba apstākļus. Ne vienmēr dārgākais modelis ir piemērotākais — dažreiz vidējas klases iekārta ar IMU un labu bateriju pilnībā pārklāj jūsu vajadzības.'
WHERE slug = 'ka-izveleties-rtk-gnss';

UPDATE blog_posts 
SET body_lv = E'## Satlab SL900 — kas tas ir?

Satlab SL900 ir jaunākās paaudzes RTK GNSS uztvērējs, kas izstrādāts ar fokusu uz mērniecības profesionāļu ikdienas vajadzībām. Ierīce apvieno augstu precizitāti, izturīgu korpusu un inteliģentas funkcijas.

## Tehniskais apskats

### Dizains un korpuss

SL900 ir izgatavots no vieglas, bet izturīgas magnija sakausējuma. Svars ir tikai 980 g, kas padara to par vienu no vieglākajiem pilnas funkcionalitātes RTK uztvērējiem tirgū.

### IMU un slīpā stieņa mērīšana

Iebūvētā 9-ass IMU sensoru platforma ļauj mērīt punktus ar stieņa slīpumu līdz pat 60°. Tas ir īpaši noderīgi vietās, kur vertikāla stieņa novietošana nav iespējama — piemēram, blakus sienām, žogiem vai koku birzēm.

### Baterija un autonomija

Iebūvētā 6800 mAh litija jonu baterija nodrošina līdz pat 12 stundu darbu ar pilnu RTK režīmu. Uzlāde notiek ar USB-C, kas ir ērti dabas apstākļos.

### Savienojamība

- Bluetooth 5.0 datu pārsūtīšanai
- 4G LTE modems, ja nepieciešams VRS savienojums
- NFC ātrai ierīces konfigurēšanai

## Kurš to izmanto?

SL900 ir populārs topogrāfu, ceļu būvnieku un zemes ierīcētāju vidū Baltijā. Tā kompaktais izmērs un augstā veiktspēja padara to par universālu instrumentu dažādiem mērniecības darbiem.'
WHERE slug = 'satlab-sl900-apskats';

UPDATE blog_posts 
SET body_lv = E'## Kas ir IMU?

IMU jeb Inerce Measurement Unit ir sensoru komplekts, kas mēra leņķisko ātrumu, paātrinājumu un dažreiz arī zemes magnētisko lauku. Mērniecībā IMU tiek izmantots, lai noteiktu mērīšanas stieņa orientāciju telpā.

## Kā IMU maina mērniecību?

### 1. Slīpā stieņa mērīšana

Tradicionāli mērniekiem bija jānoliek mērīšanas stienis vertikāli, lai iegūtu precīzu punkta koordināti. Ar IMU tas vairs nav nepieciešams — sistēma automātiski koriģē koordinātas, zinot stieņa slīpumu un virzienu.

### 2. Laika ietaupījums

Pētījumi rāda, ka slīpā stieņa mērīšana var paātrināt mērījumu veikšanu par 30–40%. Tas īpaši svarīgi lielos objektos, kur jānomēra simtiem vai tūkstošiem punktu.

### 3. Drošība un ērtības

Nav vairs jāuzspiež vertikāla pozīcija bīstamās vietās — blakus ceļiem, dziļām bedrēm vai stāvām nogāzēm. Mērnieks var turēt stieni dabiskā, ērtā pozīcijā.

## Tehniskais pamats

IMU mērniecības uztvērējos parasti sastāv no:
- **Giroskopiem** — mēra rotāciju ap trim asīm
- **Paātrinājuma mērītājiem** — noteik gravitācijas un kustības paātrinājumu
- **Magnētometriem** — orientācijas noteikšanai pēc Zemes magnētiskā lauka

Algoritmi reālajā laikā apstrādā šos datus un koriģē GNSS koordinātas, ņemot vērā stieņa slīpuma leņķi un novietojumu.

## Nākotne

IMU tehnoloģija turpina attīstīties. Jaunākie sensori kļūst mazāki, precīzāki un enerģētiski efektīvāki. Tiek pētītas arī iespējas apvienot IMU ar mašīnmācīšanos, lai automātiski atpazītu un koriģētu mērījumu kļūdas.'
WHERE slug = 'imu-tehnologijas';