import { Col, Divider, Row, Form, type FormInstance } from 'antd'
import { CustomFormItem } from '../../../components/form/CustomFormItem'
import { CustomRadioGroup } from '../../../components/radio/CustomRadioGroups'
import {
  EstadoCivil,
  Moneda,
  Sexo,
  TipoDocIdent,
  TipoEmpleo,
  TipoEntidad,
} from '../../../utils/constants'
import { CustomSelect } from '../../../components/select/CustomSelect'
import { CustomInput } from '../../../components/input/CustomInput'
import CustomInputDate from '../../../components/date/CustomInputDate'
import type {
  CiudadDto,
  MunicipioDto,
  PaisDto,
  ProvinciaDto,
} from '../dto/generalDto'
import { CustomInputNumber } from '../../../components/input/CustomInputNumber'
import { useQuery } from '@tanstack/react-query'
import generalService from '../services/generalService'

export interface PropsInterface {
  edit?: boolean
  view?: boolean
  form?: FormInstance
  isProvider?: boolean
}

function GeneralEntityForm({ edit, view, form, isProvider }: PropsInterface) {
  const watchTipoEntidad = Form.useWatch('tipo_entidad', form)
  const watchMonedaIngreso = Form.useWatch('moneda_ingreso', form)
  const watchIdProvincia = Form.useWatch('id_provincia', form)
  const watchIdMunicipio = Form.useWatch('id_municipio', form)

  const isEmpresa = watchTipoEntidad === TipoEntidad.EMPRESA
  const coinLabel = watchMonedaIngreso || ''
  
  // ... imports search key ...
  const { data: dataPais } = useQuery({
    queryKey: ['getCountry'],
    queryFn: generalService.getCountry,
  })
  const paises: PaisDto[] = dataPais?.countries
  const { data: dataProvince } = useQuery({
    queryKey: ['getProvince'],
    queryFn: generalService.getProvince,
  })
  const provinces: ProvinciaDto[] = dataProvince?.province

  const { data: dataMunicipes } = useQuery({
    queryKey: ['getMunicipio'],
    queryFn: generalService.getMunicipio,
  })
  const municipios: MunicipioDto[] = dataMunicipes?.municip

  const { data: dataSector } = useQuery({
    queryKey: ['getSector'],
    queryFn: generalService.getSector,
  })
  const Sectors: CiudadDto[] = dataSector?.sector

  return (
    <>
      <Divider orientation="left">Datos Generales</Divider>
      <Row justify={'space-around'}>
        <Col xs={24} md={10}>
          {(edit || view) && (
            <CustomFormItem required label="Código" name="id">
              <CustomInput readOnly />
            </CustomFormItem>
          )}
          <CustomFormItem required label="Tipo de Entidad" name="tipo_entidad">
            <CustomRadioGroup
              disabled={view}
              options={[
                { label: 'Fisica', value: TipoEntidad.FISICA },
                { label: 'Empresa', value: TipoEntidad.EMPRESA },
              ]}
            />
          </CustomFormItem>
          <CustomFormItem required label="Tipo Documento" name="tipo_doc_ident">
            <CustomSelect
              disabled={view}
              options={[
                { label: 'CEDULA', value: TipoDocIdent.Cedula },
                { label: 'RNC', value: TipoDocIdent.Rnc },
                { label: 'PASAPORTE', value: TipoDocIdent.Pasaporte },
              ]}
            />
          </CustomFormItem>
          <CustomFormItem required label="NO. Documento" name="documento_ident">
            <CustomInput.Search
              readOnly={view}
              // onSearch={(value) => console.log(value)}
            />
          </CustomFormItem>
          <CustomFormItem required label="Nombre" name="nombres">
            <CustomInput readOnly={view} />
          </CustomFormItem>
          {!isEmpresa && (
            <>
              <CustomFormItem required label="Apellido" name="apellidos">
                <CustomInput readOnly={view} />
              </CustomFormItem>

              <CustomFormItem required label="Sexo" name="sexo">
                <CustomRadioGroup
                  disabled={view}
                  options={[
                    { label: 'Masculino', value: Sexo.Masculino },
                    { label: 'Femenino', value: Sexo.Femenino },
                  ]}
                />
              </CustomFormItem>
              <CustomFormItem required label="Estado Civil" name="estado_civil">
                <CustomSelect
                  disabled={view}
                  options={EstadoCivil.map((estado) => ({
                    label: estado.descripcion,
                    value: estado.valor,
                  }))}
                />
              </CustomFormItem>
            </>
          )}
          <CustomFormItem label="Teléfono" name="telefono">
            <CustomInput readOnly={view} />
          </CustomFormItem>
          <CustomFormItem type="email" label="Correo Electrónico" name="email">
            <CustomInput readOnly={view} />
          </CustomFormItem>
        </Col>
        <Col xs={24} md={10}>
          <CustomFormItem
            required={!isEmpresa}
            label={`Fecha ${isEmpresa ? 'Creación' : 'Nacimiento'}`}
            name="fecha_nacimiento"
          >
            <CustomInputDate readOnly={view} disabledWeather="FUTURE" />
          </CustomFormItem>
          <CustomFormItem required label="Nacionalidad" name="id_pais">
            <CustomSelect
              options={paises?.map((pais: PaisDto) => ({
                label: pais?.nacionalidad,
                value: pais?.id,
              }))}
            />
          </CustomFormItem>
          <CustomFormItem required label="Provincia" name="id_provincia">
            <CustomSelect
              disabled={view}
              onChange={() => {
                form?.resetFields(['id_municipio', 'id_ciudad'])
              }}
              options={provinces?.map((prov: ProvinciaDto) => ({
                label: prov?.nombre,
                value: prov?.id,
              }))}
            />
          </CustomFormItem>
          <CustomFormItem required label="Ciudad" name="id_municipio">
            <CustomSelect
              disabled={view}
              onChange={() => {
                form?.resetFields(['id_ciudad'])
              }}
              options={municipios
                ?.filter(
                  (municip) => municip?.id_provincia === watchIdProvincia,
                )
                ?.map((municip: MunicipioDto) => ({
                  label: municip?.nombre,
                  value: municip?.id,
                }))}
            />
          </CustomFormItem>
          <CustomFormItem label="Sector" name="id_ciudad">
            <CustomSelect
              disabled={view}
              options={Sectors?.filter(
                (sector) => sector?.id_municipio === watchIdMunicipio,
              )?.map((sector: CiudadDto) => ({
                label: sector?.nombre,
                value: sector?.id,
              }))}
            />
          </CustomFormItem>
          <CustomFormItem label="Detalles Direccion" name="desc_direccion">
            <CustomInput.TextArea readOnly={view} />
          </CustomFormItem>
        </Col>

        {!isProvider && (
          <>
            <Divider orientation="left">
              {`${!isEmpresa ? 'Ocupación /' : ''}Ingresos`}
            </Divider>
            {!isEmpresa && (
              <Col xs={24} md={10}>
                <CustomFormItem required label="Tipo de Empleo" name="tipo_empleo">
                  <CustomSelect
                    disabled={view}
                    options={TipoEmpleo.map((tipo) => ({
                      label: tipo.descripcion,
                      value: tipo.valor,
                    }))}
                  />
                </CustomFormItem>
                <CustomFormItem label="Ocupación" name="ocupacion">
                  <CustomInput readOnly={view} />
                </CustomFormItem>
                <CustomFormItem
                  label="Lugar de Trabajo"
                  name="nombre_empresa_trabajo"
                >
                  <CustomInput readOnly={view} />
                </CustomFormItem>
                <CustomFormItem
                  label="Posición de desempeño"
                  name="posicion_empresa"
                >
                  <CustomInput readOnly={view} />
                </CustomFormItem>
              </Col>
            )}
            <Col xs={24} md={10}>
              <CustomFormItem required label="Moneda ingreso" name="moneda_ingreso">
                <CustomRadioGroup
                  block
                  optionType="button"
                  buttonStyle="solid"
                  disabled={view}
                  options={[
                    { label: Moneda.Peso, value: Moneda.Peso },
                    { label: Moneda.Dolar, value: Moneda.Dolar },
                    { label: Moneda.Euro, value: Moneda.Euro },
                  ]}
                />
              </CustomFormItem>
              <CustomFormItem required label="Ingresos" name="ingreso_promedio">
                <CustomInputNumber
                  readOnly={view}
                  disabled={!coinLabel}
                  addonBefore={`${coinLabel} $`}
                />
              </CustomFormItem>
              {!isEmpresa && (
                <>
                  <CustomFormItem label="Otros Ingresos" name="otro_ingreso">
                    <CustomInputNumber
                      readOnly={view}
                      disabled={!coinLabel}
                      addonBefore={`${coinLabel} $`}
                    />
                  </CustomFormItem>
                  <CustomFormItem
                    label="Detalles de Otros Ingresos"
                    name="razon_otro_ingreso"
                  >
                    <CustomInput.TextArea readOnly={view} disabled={!coinLabel} />
                  </CustomFormItem>
                </>
              )}
            </Col>
          </>
        )}
      </Row>
    </>
  )
}

export default GeneralEntityForm
