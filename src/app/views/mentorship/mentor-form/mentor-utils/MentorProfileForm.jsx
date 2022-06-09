import React, { useState } from 'react';
import {
  Grid, TextField, Button, MenuItem
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import bc from 'app/services/breathecode';
import { useHistory } from 'react-router-dom';
import { AsyncAutocomplete } from '../../../../components/Autocomplete'

const propTypes = {
  initialValues: PropTypes.objectOf(PropTypes.object).isRequired,
  serviceList: PropTypes.array,
};

export const MentorProfileForm = ({ initialValues, serviceList }) => {
  const history = useHistory();
  const [mentorSlug, setMentorSlug] = useState('')
  const [mentor, setMentor] = useState({})

  const [syllabusArray, setSyllabusArray] = useState([]);

  const postMentor = (values) => {
    let serviceIndex = serviceList.filter((service) => {
      return values.service === service.name
    })
    let filteredSyllArr = mentor.syllabus.map((syl) => syl.id)
    bc.mentorship().addAcademyMentor({
      user: values.id,
      booking_url: values.booking_url,
      online_meeting_url: values.online_meeting_url,
      slug: mentorSlug,
      price_per_hour: values.price_per_hour,
      service: serviceIndex[0].id,
      syllabus: filteredSyllArr,
      email: values.email
    }).then((data) => (data.status == 200) && history.push('/mentors')).catch(error => setFormError('Error while saving mentor'))
  }

  const validate = (values, props /* only available when using withFormik */) => {
    const errors = {};
    const match = /https?:\/\/calendly\.com\/([\w\-]+)\/?/gm.exec(values.booking_url);
    if (!match || match[1] == undefined) {
      errors.booking_url = 'Booking URL must start with https://calendly.com'
    }
    else setMentorSlug(match[1])

    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={(values) => postMentor(values)}
      enableReinitialize
    >
      {({ values, handleChange, handleSubmit, setFieldValue, errors }) => (
        <form className="p-4" onSubmit={handleSubmit}>
          <Grid container spacing={3} alignItems="center">
            <Grid item md={1} sm={4} xs={12}>
              Name
            </Grid>
            <Grid item md={11} sm={8} xs={12}>
              <div className="flex">
                <TextField
                  className="m-2"
                  label="First Name"
                  name="first_name"
                  size="small"
                  required
                  variant="outlined"
                  value={values.first_name}
                  onChange={handleChange}
                />
                <TextField
                  className="m-2"
                  label="Last Name"
                  name="last_name"
                  size="small"
                  required
                  variant="outlined"
                  value={values.last_name}
                  onChange={handleChange}
                />
              </div>
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Booking Url
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                label="Booking Url"
                name="booking_url"
                size="small"
                required
                variant="outlined"
                value={values.booking_url}
                onChange={handleChange}
              />
              {errors.booking_url && <small className="text-error d-block">{errors.booking_url}</small>}
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Backup Meeting URL
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                label="Backup Meeting Url"
                name="meeonline_meeting_urlting_url"
                size="small"
                type="text"
                variant="outlined"
                value={values.online_meeting_url}
                onChange={handleChange}
              />
              {errors.online_meeting_url && <small className="text-error d-block">{errors.online_meeting_url}</small>}
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Email
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                label="Email"
                name="email"
                size="small"
                type="email"
                required
                variant="outlined"
                value={values.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Price per hour
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                label="Price per hour"
                name="price_per_hour"
                size="small"
                type="number"
                required
                variant="outlined"
                value={values.price_per_hour}
                InputProps={{
                  inputProps: {
                    max: 100, min: 0
                  }
                }}
                onChange={handleChange}
              />
            </Grid>

            <Grid item md={2} sm={4} xs={12}>
              Service
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                className="m-2"
                label="Service"
                data-cy="service"
                size="small"
                variant="outlined"
                value={values.service}
                onChange={(e) => {
                  setFieldValue('service', e.target.value);
                }}
                select
              >
                {serviceList.map((singleService, i) => {
                  return (
                    <MenuItem value={singleService.name || 'Loading'} key={`${singleService.name}${i}`}>
                      {singleService.name.toUpperCase()}
                    </MenuItem>
                  )
                })}
              </TextField>
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Slug
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                label="Slug"
                name="slug"
                size="small"
                type="text"
                variant="outlined"
                value={mentorSlug}
              />
              <small className="text-muted d-block">Will be suggested from the booking url</small>
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Syllabus expertise
            </Grid>
            <Grid item md={4} sm={8} xs={12}>
              <AsyncAutocomplete
                getOptionLabel={(option) => `${option.name}`}
                onChange={(selectedSyllabus) => {
                  setMentor({ ...mentor, syllabus: selectedSyllabus })
                }}
                width="100%"
                key={mentor.syllabus}
                asyncSearch={async () => {
                  const response = await bc.admissions().getAllSyllabus();
                  setSyllabusArray(response.data)
                  return response.data;
                }}
                size="small"
                label="Syllabus expertise"
                multiple
                initialValues={mentor.syllabus}
                debounced={false}
                value={mentor.syllabus}
              />
            </Grid>
          </Grid>
          <div className="mt-6">
            <Button color="primary" variant="contained" type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
    </Formik>
  )
};

MentorProfileForm.propTypes = propTypes;
