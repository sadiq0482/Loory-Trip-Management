/* =========================================================
   DATE FORMAT
   ========================================================= */

export const fmt = d => {
  if (!d) return '-';

  const value =
    String(d).includes('T')
      ? d
      : `${d}T00:00:00`;

  return new Date(value)
    .toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
};


/* =========================================================
   TRIP DETAIL
   ========================================================= */

export const detail = t => {

  if (t.type === 'DIP') {

    const n = Number(t.trips || 0);

    return `${n} trip${n === 1 ? '' : 's'}`;

  }

  return (
    '₹' +
    Number(t.amount || 0)
      .toLocaleString('en-IN')
  );
};


/* =========================================================
   TEXT WRAP
   ========================================================= */

function wrap(c, text, x, y, w, lineHeight) {

  let line = '';

  for (
    const word of String(text ?? '').split(/\s+/)
  ) {

    const test =
      line + word + ' ';

    if (
      c.measureText(test).width > w &&
      line
    ) {

      c.fillText(
        line,
        x,
        y
      );

      line =
        word + ' ';

      y += lineHeight;

    } else {

      line = test;

    }
  }

  if (line) {
    c.fillText(
      line,
      x,
      y
    );
  }

  return y + lineHeight;
}


/* =========================================================
   SHARE ONE TRIP IMAGE
   ========================================================= */

export async function sharePng(t) {

  const W = 900;
  const H = 1400;

  const cv =
    document.createElement('canvas');

  cv.width = W;
  cv.height = H;

  const c =
    cv.getContext('2d');


  /* Background */

  c.fillStyle = '#ffffff';

  c.fillRect(
    0,
    0,
    W,
    H
  );


  /* Header */

  c.fillStyle = '#1f5c46';

  c.fillRect(
    0,
    0,
    W,
    110
  );


  c.fillStyle = '#ffffff';

  c.font =
    'bold 42px sans-serif';

  c.fillText(
    'Lorry Trip Details',
    40,
    68
  );


  /* Gold line */

  c.fillStyle = '#e8a317';

  c.fillRect(
    0,
    110,
    W,
    8
  );


  let y = 175;


  /* Key / value */

  const kv = (
    label,
    value
  ) => {

    c.fillStyle = '#66726b';

    c.font =
      '23px sans-serif';

    c.fillText(
      label,
      40,
      y
    );


    c.fillStyle = '#1d2a24';

    c.font =
      'bold 28px sans-serif';


    y = wrap(
      c,
      value || '-',
      40,
      y + 38,
      800,
      38
    ) + 18;
  };


  /* Complete information */

  kv(
    'Trip Date',
    fmt(t.tripDate)
  );

  kv(
    'Lorry Number',
    t.lorryNumber
  );

  kv(
    'Load Pickup',
    t.pickup
  );

  kv(
    'From Address',
    t.fromAddr
  );

  kv(
    'To Address',
    t.toAddr
  );

  kv(
    'Type',
    t.type
  );


  if (t.type === 'DIP') {

    kv(
      'Number of Trips',
      t.trips
    );

  } else {

    kv(
      'Trip Amount',
      '₹' +
      Number(t.amount || 0)
        .toLocaleString('en-IN')
    );

  }


  kv(
    'Payer Name',
    t.payer || '-'
  );


  kv(
    'Status',
    t.status === 'paid'
      ? 'Paid'
      : 'Active'
  );


  /* Final canvas */

  const out =
    document.createElement('canvas');

  out.width = W;

  out.height =
    Math.max(
      y + 40,
      500
    );


  out
    .getContext('2d')
    .drawImage(
      cv,
      0,
      0
    );


  const blob =
    await new Promise(resolve =>
      out.toBlob(
        resolve,
        'image/png'
      )
    );


  const file =
    new File(
      [blob],
      `lorry-trip-${t.id}.png`,
      {
        type: 'image/png'
      }
    );


  /* Phone share */

  try {

    if (
      navigator.canShare?.({
        files: [file]
      })
    ) {

      await navigator.share({
        files: [file],
        title: 'Lorry Trip'
      });

      return;
    }

  } catch (e) {

    if (
      e.name === 'AbortError'
    ) {
      return;
    }

  }


  /* Browser fallback */

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement('a');

  a.href = url;

  a.download =
    file.name;

  a.click();


  setTimeout(
    () =>
      URL.revokeObjectURL(url),
    1500
  );
}


/* =========================================================
   FIT TEXT INTO TABLE CELL
   ========================================================= */

const fit = (
  c,
  value,
  width
) => {

  let text =
    String(value ?? '');

  if (
    c.measureText(text).width <=
    width
  ) {
    return text;
  }


  while (
    text.length &&
    c.measureText(
      text + '…'
    ).width > width
  ) {

    text =
      text.slice(0, -1);
  }


  return text + '…';
};


/* =========================================================
   DOWNLOAD / SHARE ALL TRIPS
   =========================================================

   ONE IMAGE

   Contains every trip in one table.
   ========================================================= */

export async function shareTable(
  list,
  title = 'All Trips'
) {

  if (
    !Array.isArray(list) ||
    list.length === 0
  ) {

    alert(
      'No trips available.'
    );

    return;
  }


  /* -------------------------------------------------------
     Canvas dimensions
     ------------------------------------------------------- */

  const W = 1900;

  const ROW = 70;

  const HEADER = 210;

  const FOOTER = 140;


  /*
    Important:
    This creates ONE tall image
    containing ALL trips.
  */

  const H =
    HEADER +
    list.length * ROW +
    FOOTER;


  const cv =
    document.createElement('canvas');

  cv.width = W;

  cv.height = H;


  const c =
    cv.getContext('2d');


  /* -------------------------------------------------------
     White background
     ------------------------------------------------------- */

  c.fillStyle = '#ffffff';

  c.fillRect(
    0,
    0,
    W,
    H
  );


  /* -------------------------------------------------------
     Title
     ------------------------------------------------------- */

  c.fillStyle = '#1f5c46';

  c.fillRect(
    0,
    0,
    W,
    95
  );


  c.fillStyle = '#ffffff';

  c.font =
    'bold 40px sans-serif';

  c.textBaseline =
    'middle';


  c.fillText(
    `${title} - ${list.length} Trips`,
    25,
    47
  );


  /* Gold line */

  c.fillStyle = '#e8a317';

  c.fillRect(
    0,
    95,
    W,
    8
  );


  /* -------------------------------------------------------
     Columns
     ------------------------------------------------------- */

  const cols = [

    ['No', 70],

    ['Trip Date', 150],

    ['Lorry No.', 170],

    ['Pickup', 120],

    ['From', 280],

    ['To', 280],

    ['Type', 100],

    ['Trips / Amount', 190],

    ['Payer', 190],

    ['Status', 120]

  ];


  /* -------------------------------------------------------
     Header row
     ------------------------------------------------------- */

  c.fillStyle =
    '#dfe9e2';

  c.fillRect(
    0,
    103,
    W,
    75
  );


  c.fillStyle =
    '#1d2a24';

  c.font =
    'bold 23px sans-serif';


  let x = 20;


  cols.forEach(
    ([name, width]) => {

      c.fillText(
        name,
        x,
        140
      );

      x += width;
    }
  );


  /* -------------------------------------------------------
     Rows
     ------------------------------------------------------- */

  list.forEach(
    (t, index) => {

      const y =
        178 +
        index * ROW;


      /* Alternate row */

      if (index % 2 === 1) {

        c.fillStyle =
          '#f4f7f4';

        c.fillRect(
          0,
          y,
          W,
          ROW
        );
      }


      const values = [

        index + 1,

        fmt(t.tripDate),

        t.lorryNumber ||
          '-',

        t.pickup ||
          '-',

        t.fromAddr ||
          '-',

        t.toAddr ||
          '-',

        t.type ||
          '-',

        detail(t),

        t.payer ||
          '-',

        t.status === 'paid'
          ? 'Paid'
          : 'Active'

      ];


      let cx = 20;


      values.forEach(
        (value, columnIndex) => {

          if (
            columnIndex === 9
          ) {

            c.fillStyle =
              t.status === 'paid'
                ? '#1f5c46'
                : '#b3261e';

          } else {

            c.fillStyle =
              '#1d2a24';
          }


          c.font =
            '21px sans-serif';


          c.fillText(
            fit(
              c,
              value,
              cols[columnIndex][1] - 15
            ),
            cx,
            y + 42
          );


          cx +=
            cols[columnIndex][1];
        }
      );


      /* Row separator */

      c.fillStyle =
        '#d5dbd3';

      c.fillRect(
        0,
        y + ROW - 1,
        W,
        1
      );

    }
  );


  /* -------------------------------------------------------
     Totals
     ------------------------------------------------------- */

  const totalTrips =
    list.reduce(
      (sum, t) =>
        sum +
        Number(t.trips || 0),
      0
    );


  const totalAmount =
    list.reduce(
      (sum, t) =>
        sum +
        Number(t.amount || 0),
      0
    );


  const paidCount =
    list.filter(
      t =>
        t.status === 'paid'
    ).length;


  const activeCount =
    list.filter(
      t =>
        t.status !== 'paid'
    ).length;


  const totalY =
    178 +
    list.length * ROW +
    20;


  c.fillStyle =
    '#1f5c46';

  c.fillRect(
    0,
    totalY,
    W,
    90
  );


  c.fillStyle =
    '#ffffff';

  c.font =
    'bold 25px sans-serif';


  c.fillText(
    `Total Trips: ${list.length}`,
    25,
    totalY + 35
  );


  c.fillText(
    `DIP Trips: ${totalTrips}`,
    350,
    totalY + 35
  );


  c.fillText(
    `Delivery Amount: ₹${totalAmount.toLocaleString('en-IN')}`,
    650,
    totalY + 35
  );


  c.fillText(
    `Paid: ${paidCount}`,
    1250,
    totalY + 35
  );


  c.fillText(
    `Active: ${activeCount}`,
    1450,
    totalY + 35
  );


  /* -------------------------------------------------------
     Convert to PNG
     ------------------------------------------------------- */

  const blob =
    await new Promise(resolve =>
      cv.toBlob(
        resolve,
        'image/png'
      )
    );


  const file =
    new File(
      [blob],
      'all-lorry-trips.png',
      {
        type: 'image/png'
      }
    );


  /* -------------------------------------------------------
     Phone share sheet
     ------------------------------------------------------- */

  try {

    if (
      navigator.canShare?.({
        files: [file]
      })
    ) {

      await navigator.share({
        files: [file],
        title: 'All Lorry Trips'
      });

      return;
    }

  } catch (e) {

    if (
      e.name === 'AbortError'
    ) {
      return;
    }

  }


  /* -------------------------------------------------------
     Desktop/browser fallback
     ------------------------------------------------------- */

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement('a');

  a.href = url;

  a.download =
    'all-lorry-trips.png';

  a.click();


  setTimeout(
    () =>
      URL.revokeObjectURL(url),
    1500
  );
}