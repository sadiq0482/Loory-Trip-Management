import { useState, useEffect, useCallback } from 'react';

import { api, hasToken, setToken } from './api';



import {

  fmt,

  detail,

  sharePng,

  shareTable

} from './utils';





/* =========================================================

   Segmented buttons

   ========================================================= */



function Seg({ opts, value, onChange }) {

  return (

    <div className="seg">

      {opts.map(o => (

        <button

          key={o}

          type="button"

          className={value === o ? 'on' : ''}

          onClick={() => onChange(o)}

        >

          {o}

        </button>

      ))}

    </div>

  );

}





/* =========================================================

   Login / Register

   ========================================================= */



function Auth({ onDone }) {

  const [mode, setMode] = useState('login');



  const [f, setF] = useState({

    name: '',

    phone: '',

    password: ''

  });



  const [err, setErr] = useState('');



  const set = key => e => {

    setF({

      ...f,

      [key]: e.target.value

    });

  };



  const go = async () => {

    setErr('');



    try {

      const d = await api(

        '/auth/' + mode,

        'POST',

        f

      );



      setToken(d.token);

      onDone();



    } catch (e) {

      setErr(e.message);

    }

  };



  return (

    <section className="card">



      <Seg

        opts={['login', 'register']}

        value={mode}

        onChange={setMode}

      />



      {mode === 'register' && (

        <>

          <label>Your name</label>



          <input

            value={f.name}

            onChange={set('name')}

          />

        </>

      )}



      <label>Phone</label>



      <input

        inputMode="tel"

        value={f.phone}

        onChange={set('phone')}

      />



      <label>Password</label>



      <input

        type="password"

        value={f.password}

        onChange={set('password')}

      />



      <button

        className="btn"

        onClick={go}

      >

        {mode === 'login'

          ? 'Log in'

          : 'Create account'}

      </button>



      <div className="err">

        {err}

      </div>



    </section>

  );

}





/* =========================================================

   Table styles

   ========================================================= */



const thStyle = {

  padding: '9px 8px',

  textAlign: 'left',

  borderBottom: '2px solid #d5ddd8',

  background: '#eef2ef',

  whiteSpace: 'nowrap',

  fontWeight: '700'

};



const tdStyle = {

  padding: '9px 8px',

  textAlign: 'left',

  borderBottom: '1px solid #e1e5e2',

  verticalAlign: 'top'

};





/* =========================================================

   Trip table

   ========================================================= */



function TripTable({

  trips,

  history,

  onPaid,

  onUndoPaid,

  onDownloadAll

}) {



  if (trips.length === 0) {

    return (

      <>

        <div className="empty">

          {history

            ? 'Nothing found.'

            : 'No active trips.'}

        </div>



        <button

          type="button"

          onClick={onDownloadAll}

          style={{

            width: '100%',

            marginTop: 12,

            padding: '11px 14px',

            borderRadius: 8,

            border: '1px solid #1f5c46',

            background: '#e8a317',

            color: '#1d2a24',

            fontWeight: 700,

            cursor: 'pointer'

          }}

        >

          📥 Download All Trips

        </button>


      </>

    );

  }



  return (

    <>

      {/* Download all trips */}

      <button

        type="button"

        onClick={onDownloadAll}

        style={{

          width: '100%',

          marginTop: 12,

          padding: '11px 14px',

          borderRadius: 8,

          border: '1px solid #1f5c46',

          background: '#e8a317',

          color: '#1d2a24',

          fontWeight: 700,

          cursor: 'pointer'

        }}

      >

        📥 Download All Trips

      </button>





      {/* Table */}

      <div

        style={{

          overflowX: 'auto',

          width: '100%',

          marginTop: 12,

          borderRadius: 8

        }}

      >



        <table

          style={{

            width: '100%',

            minWidth: 1050,

            borderCollapse: 'collapse',

            background: '#fff',

            fontSize: 13

          }}

        >



          <thead>

            <tr>

              <th style={thStyle}>

                Date

              </th>



              <th style={thStyle}>

                Lorry No.

              </th>



              <th style={thStyle}>

                Pickup

              </th>



              <th style={thStyle}>

                From

              </th>



              <th style={thStyle}>

                To

              </th>



              <th style={thStyle}>

                Type

              </th>



              <th style={thStyle}>

                Trips / Amount

              </th>



              <th style={thStyle}>

                Payer

              </th>



              <th style={thStyle}>

                Status

              </th>



              <th style={thStyle}>

                Action

              </th>

            </tr>

          </thead>





          <tbody>



            {trips.map(t => (



              <tr key={t.id}>



                {/* Date */}

                <td style={tdStyle}>

                  {fmt(t.tripDate)}

                </td>





                {/* Lorry */}

                <td

                  style={{

                    ...tdStyle,

                    fontWeight: 'bold',

                    whiteSpace: 'nowrap'

                  }}

                >

                  {t.lorryNumber || '-'}

                </td>





                {/* Pickup */}

                <td style={tdStyle}>

                  {t.pickup || '-'}

                </td>





                {/* From */}

                <td

                  style={{

                    ...tdStyle,

                    maxWidth: 180

                  }}

                >

                  {t.fromAddr || '-'}

                </td>





                {/* To */}

                <td

                  style={{

                    ...tdStyle,

                    maxWidth: 180

                  }}

                >

                  {t.toAddr || '-'}

                </td>





                {/* Type */}

                <td style={tdStyle}>

                  <span

                    className="badge"

                    style={{

                      display: 'inline-block'

                    }}

                  >

                    {t.type}

                  </span>

                </td>





                {/* Trips / Amount */}

                <td

                  style={{

                    ...tdStyle,

                    whiteSpace: 'nowrap',

                    fontWeight: 'bold'

                  }}

                >

                  {detail(t)}

                </td>





                {/* Payer */}

                <td style={tdStyle}>

                  {t.payer || '-'}

                </td>





                {/* Status */}

                <td

                  style={{

                    ...tdStyle,

                    whiteSpace: 'nowrap',

                    fontWeight: 600

                  }}

                >

                  {t.status === 'paid'

                    ? '✅ Paid'

                    : 'Active'}

                </td>





                {/* Action */}

                <td

                  style={{

                    ...tdStyle,

                    minWidth: 180

                  }}

                >



                  <div

                    style={{

                      display: 'flex',

                      gap: 6,

                      flexDirection: 'column'

                    }}

                  >



                    {/* Individual share */}

                    <button

                      className="btn alt"

                      type="button"

                      style={{

                        padding: '7px 10px',

                        fontSize: 12,

                        whiteSpace: 'nowrap'

                      }}

                      onClick={() =>

                        sharePng(t)

                      }

                    >

                      📷 Share Image

                    </button>





                    {/* Paid */}

                    {!history &&

                      t.status !== 'paid' && (



                        <button

                          className="btn"

                          type="button"

                          style={{

                            padding: '7px 10px',

                            fontSize: 12

                          }}

                          onClick={() =>

                            onPaid(t)

                          }

                        >

                          Paid

                        </button>



                      )}




                      {/* Undo payment from History */}
                      {history &&
                        t.status === 'paid' && (
                          <button
                            className="btn alt"
                            type="button"
                            style={{
                              padding: '7px 10px',
                              fontSize: 12
                            }}
                            onClick={() =>
                              onUndoPaid(t)
                            }
                          >
                            ↩️ Undo Payment
                          </button>
                        )}
                  </div>



                </td>



              </tr>



            ))}



          </tbody>



        </table>



      </div>

    </>

  );

}





/* =========================================================

   Default form

   ========================================================= */



const EMPTY = {

  tripDate: new Date()

    .toISOString()

    .split('T')[0],



  lorryNumber: '',



  pickup: 'Wagon',



  fromAddr: '',



  toAddr: '',



  type: 'DIP',



  trips: '',



  amount: '',



  payer: ''

};





/* =========================================================

   Trips

   ========================================================= */



function Trips({ onLogout }) {



  const [tab, setTab] = useState('trips');



  const [form, setForm] =

    useState(EMPTY);



  const [active, setActive] =

    useState([]);



  const [hist, setHist] =

    useState([]);



  const [q, setQ] =

    useState('');



  const [err, setErr] =

    useState('');





  const set = (key, value) => {

    setForm(f => ({

      ...f,

      [key]: value

    }));

  };





  /* -------------------------------------------------------

     Load active + history

     ------------------------------------------------------- */



  const load = useCallback(

    async () => {



      try {



        const activeData =

          await api(

            '/trips?status=active'

          );



        const historyData =

          await api(

            '/trips?q=' +

            encodeURIComponent(q)

          );



        setActive(activeData);

        setHist(historyData);



      } catch (e) {



        setErr(e.message);



      }



    },

    [q]

  );





  useEffect(() => {

    load();

  }, [load]);





  /* -------------------------------------------------------

     Save trip

     ------------------------------------------------------- */



  const save = async () => {



    setErr('');



    if (!form.tripDate) {

      setErr(

        'Please select trip date.'

      );

      return;

    }





    if (!form.lorryNumber.trim()) {

      setErr(

        'Please enter lorry number.'

      );

      return;

    }





    if (!form.fromAddr.trim()) {

      setErr(

        'Please enter From address.'

      );

      return;

    }





    if (!form.toAddr.trim()) {

      setErr(

        'Please enter To address.'

      );

      return;

    }





    if (

      form.type === 'DIP' &&

      (!form.trips ||

        Number(form.trips) < 1)

    ) {

      setErr(

        'Please enter number of trips.'

      );

      return;

    }





    if (

      form.type === 'Delivery' &&

      (

        form.amount === '' ||

        Number(form.amount) < 0

      )

    ) {

      setErr(

        'Please enter trip amount.'

      );

      return;

    }





    try {



      await api(

        '/trips',

        'POST',

        {

          ...form,



          lorryNumber:

            form.lorryNumber.trim(),



          fromAddr:

            form.fromAddr.trim(),



          toAddr:

            form.toAddr.trim(),



          payer:

            form.payer.trim(),



          trips:

            form.type === 'DIP'

              ? parseInt(form.trips, 10)

              : null,



          amount:

            form.type === 'Delivery'

              ? parseFloat(form.amount)

              : null

        }

      );





      setForm({

        ...EMPTY,



        tripDate:

          new Date()

            .toISOString()

            .split('T')[0]

      });





      await load();



    } catch (e) {



      setErr(e.message);



    }

  };





  /* -------------------------------------------------------

     Mark paid

     ------------------------------------------------------- */



  const paid = async t => {



    if (

      confirm(

        'Payment received? It will leave the active list and stay in History.'

      )

    ) {



      try {



        await api(

          `/trips/${t.id}/paid`,

          'PATCH'

        );



        await load();



      } catch (e) {



        setErr(e.message);



      }

    }

  };





  /* -------------------------------------------------------
     Undo payment
     ------------------------------------------------------- */

  const undoPaid = async t => {
    if (
      !confirm(
        'Undo payment? This trip will move back to Active Trips.'
      )
    ) {
      return;
    }

    try {
      await api(
        `/trips/${t.id}/undo-paid`,
        'PATCH'
      );

      await load();
      setTab('trips');
    } catch (e) {
      setErr(e.message);
    }
  };


  /* -------------------------------------------------------
     Download all active trips
     ------------------------------------------------------- */



  const downloadActive = async () => {



    if (!active.length) {

      alert('No active trips available.');

      return;

    }



    try {



      await shareTable(

        active,

        'Active Lorry Trips'

      );



    } catch (e) {



      setErr(

        e.message ||

        'Could not create trip image.'

      );



    }

  };





  /* -------------------------------------------------------

     Download all history

     ------------------------------------------------------- */



  const downloadHistory = async () => {



    if (!hist.length) {

      alert('No history trips available.');

      return;

    }



    try {



      await shareTable(

        hist,

        'Lorry Trip History'

      );



    } catch (e) {



      setErr(

        e.message ||

        'Could not create trip image.'

      );



    }

  };





  /* =======================================================

     UI

     ======================================================= */



  return (

    <>



      {/* ---------------------------------------------------

          Tabs

      --------------------------------------------------- */}



      <div className="tabs">



        <button

          className={

            tab === 'trips'

              ? 'on'

              : ''

          }

          onClick={() =>

            setTab('trips')

          }

        >

          Trips

        </button>





        <button

          className={

            tab === 'history'

              ? 'on'

              : ''

          }

          onClick={() =>

            setTab('history')

          }

        >

          History

        </button>



      </div>





      {/* ===================================================

          TRIPS TAB

      =================================================== */}



      {tab === 'trips' ? (



        <>



          {/* Trip form */}

          <div className="card">



            <label>

              Trip date

            </label>



            <input

              type="date"

              value={form.tripDate}

              onChange={e =>

                set(

                  'tripDate',

                  e.target.value

                )

              }

            />





            <label>

              Lorry number

            </label>



            <input

              value={form.lorryNumber}

              placeholder="e.g. AP21AB1234"

              onChange={e =>

                set(

                  'lorryNumber',

                  e.target.value

                )

              }

            />





            <label>

              Load pickup point

            </label>



            <Seg

              opts={[

                'Wagon',

                'Godown'

              ]}

              value={form.pickup}

              onChange={v =>

                set('pickup', v)

              }

            />





            <label>

              From address

            </label>



            <textarea

              rows="2"

              value={form.fromAddr}

              onChange={e =>

                set(

                  'fromAddr',

                  e.target.value

                )

              }

            />





            <label>

              To address

            </label>



            <textarea

              rows="2"

              value={form.toAddr}

              onChange={e =>

                set(

                  'toAddr',

                  e.target.value

                )

              }

            />





            <label>

              Type

            </label>



            <Seg

              opts={[

                'DIP',

                'Delivery'

              ]}

              value={form.type}

              onChange={v =>

                set('type', v)

              }

            />





            {form.type === 'DIP' ? (



              <>

                <label>

                  How many trips?

                </label>



                <input

                  type="number"

                  min="1"

                  value={form.trips}

                  onChange={e =>

                    set(

                      'trips',

                      e.target.value

                    )

                  }

                />

              </>



            ) : (



              <>

                <label>

                  Trip amount (₹)

                </label>



                <input

                  type="number"

                  min="0"

                  value={form.amount}

                  onChange={e =>

                    set(

                      'amount',

                      e.target.value

                    )

                  }

                />

              </>



            )}





            <label>

              Payer name

            </label>



            <input

              value={form.payer}

              placeholder="Who pays you?"

              onChange={e =>

                set(

                  'payer',

                  e.target.value

                )

              }

            />





            <button

              className="btn"

              type="button"

              onClick={save}

            >

              Save trip

            </button>





            <div className="err">

              {err}

            </div>



          </div>





          {/* Active trips */}

          <TripTable

            trips={active}

            history={false}

            onPaid={paid}

            onUndoPaid={undoPaid}
            onDownloadAll={downloadActive}

          />



        </>



      ) : (



        /* =================================================

           HISTORY TAB

           ================================================= */



        <>



          <input

            type="search"

            placeholder="Search history…"

            value={q}

            onChange={e =>

              setQ(e.target.value)

            }

          />





          <TripTable

            trips={hist}

            history={true}

            onPaid={paid}

            onUndoPaid={undoPaid}
            onDownloadAll={downloadHistory}

          />



        </>



      )}





      {/* Logout */}

      <button

        className="btn alt"

        style={{

          marginTop: 20

        }}

        type="button"

        onClick={onLogout}

      >

        Log out

      </button>



    </>

  );

}





/* =========================================================

   App

   ========================================================= */



export default function App() {



  const [loggedIn, setLoggedIn] =

    useState(hasToken());





  return (

    <main>



      <h1>

        🚛 Lorry Trips

      </h1>





      {loggedIn ? (



        <Trips

          onLogout={() => {

            setToken(null);

            setLoggedIn(false);

          }}

        />



      ) : (



        <Auth

          onDone={() =>

            setLoggedIn(true)

          }

        />



      )}



    </main>

  );

}