import { Col, Divider, Row, type FormInstance } from 'antd'
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
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import generalService from '../services/generalService'

export interface PropsInterface {
  edit?: boolean
  view?: boolean
  form?: FormInstance
}

function GeneralEntityForm({ edit, view, form }: PropsInterface) {
  const [coinIngres, setCoinIngres] = useState<string | null>('')
  const [provinceSelected, setProvinceSelected] = useState<number | null>(null)
  const [ciudadSelected, setCiudadSelected] = useState<number | null>(null)
  const [tipoClientEmpresa, setTipoClientEmpresa] = useState<boolean>(false)
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
            <CustomFormItem required label="Código" name="ID">
              <CustomInput readOnly />
            </CustomFormItem>
          )}
          <CustomFormItem required label="Tipo de Entidad" name="TIPO_ENTIDAD">
            <CustomRadioGroup
              disabled={view}
              onChange={(value) =>
                setTipoClientEmpresa(
                  value.target.value === TipoEntidad.EMPRESA ? true : false,
                )
              }
              options={[
                { label: 'Fisica', value: TipoEntidad.FISICA },
                { label: 'Empresa', value: TipoEntidad.EMPRESA },
              ]}
            />
          </CustomFormItem>
          <CustomFormItem required label="Tipo Documento" name="TIPO_DOC_IDENT">
            <CustomSelect
              disabled={view}
              options={[
                { label: 'CEDULA', value: TipoDocIdent.Cedula },
                { label: 'RNC', value: TipoDocIdent.Rnc },
                { label: 'PASAPORTE', value: TipoDocIdent.Pasaporte },
              ]}
            />
          </CustomFormItem>
          <CustomFormItem required label="NO. Documento" name="DOCUMENTO_IDENT">
            <CustomInput.Search
              readOnly={view}
              // onSearch={(value) => console.log(value)}
            />
          </CustomFormItem>
          <CustomFormItem required label="Nombre" name="NOMBRES">
            <CustomInput readOnly={view} />
          </CustomFormItem>
          {!tipoClientEmpresa && (
            <>
              <CustomFormItem required label="Apellido" name="APELLIDOS">
                <CustomInput readOnly={view} />
              </CustomFormItem>

              <CustomFormItem required label="Sexo" name="SEXO">
                <CustomRadioGroup
                  disabled={view}
                  options={[
                    { label: 'Masculino', value: Sexo.Masculino },
                    { label: 'Femenino', value: Sexo.Femenino },
                  ]}
                />
              </CustomFormItem>
              <CustomFormItem required label="Estado Civil" name="ESTADO_CIVIL">
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
          <CustomFormItem label="Teléfono" name="TELEFONO">
            <CustomInput readOnly={view} />
          </CustomFormItem>
          <CustomFormItem type="email" label="Correo Electrónico" name="EMAIL">
            <CustomInput readOnly={view} />
          </CustomFormItem>
        </Col>
        <Col xs={24} md={10}>
          <CustomFormItem
            required={!tipoClientEmpresa}
            label={`Fecha ${tipoClientEmpresa ? 'Creación' : 'Nacimiento'}`}
            name="FECHA_NACIMIENTO"
          >
            <CustomInputDate readOnly={view} disabledWeather="FUTURE" />
          </CustomFormItem>
          <CustomFormItem required label="Nacionalidad" name="ID_PAIS">
            <CustomSelect
              options={paises?.map((pais: PaisDto) => ({
                label: pais?.NACIONALIDAD,
                value: pais?.ID,
              }))}
            />
          </CustomFormItem>
          <CustomFormItem required label="Provincia" name="ID_PROVINCIA">
            <CustomSelect
              disabled={view}
              onChange={(value) => {
                setProvinceSelected(value)
                form?.resetFields(['ID_MUNICIPIO', 'ID_CIUDAD'])
              }}
              options={provinces?.map((prov: ProvinciaDto) => ({
                label: prov?.NOMBRE,
                value: prov?.ID,
              }))}
            />
          </CustomFormItem>
          <CustomFormItem required label="Ciudad" name="ID_MUNICIPIO">
            <CustomSelect
              disabled={view}
              onChange={(value) => {
                setCiudadSelected(value)
                form?.resetFields(['ID_CIUDAD'])
              }}
              options={municipios
                ?.filter(
                  (municip) => municip?.ID_PROVINCIA === provinceSelected,
                )
                ?.map((municip: MunicipioDto) => ({
                  label: municip?.NOMBRE,
                  value: municip?.ID,
                }))}
            />
          </CustomFormItem>
          <CustomFormItem label="Sector" name="ID_CIUDAD">
            <CustomSelect
              disabled={view}
              options={Sectors?.filter(
                (sector) => sector?.ID_MUNICIPIO === ciudadSelected,
              )?.map((sector: CiudadDto) => ({
                label: sector?.NOMBRE,
                value: sector?.ID,
              }))}
            />
          </CustomFormItem>
          <CustomFormItem label="Detalles Direccion" name="DESC_DIRECCION">
            <CustomInput.TextArea readOnly={view} />
          </CustomFormItem>
        </Col>
        <Divider orientation="left">
          {`${!tipoClientEmpresa ? 'Ocupación /' : ''}Ingresos`}
        </Divider>
        {!tipoClientEmpresa && (
          <Col xs={24} md={10}>
            <CustomFormItem required label="Tipo de Empleo" name="TIPO_EMPLEO">
              <CustomSelect
                disabled={view}
                options={TipoEmpleo.map((tipo) => ({
                  label: tipo.descripcion,
                  value: tipo.valor,
                }))}
              />
            </CustomFormItem>
            <CustomFormItem label="Ocupación" name="OCUPACION">
              <CustomInput readOnly={view} />
            </CustomFormItem>
            <CustomFormItem
              label="Lugar de Trabajo"
              name="NOMBRE_EMPRESA_TRABAJO"
            >
              <CustomInput readOnly={view} />
            </CustomFormItem>
            <CustomFormItem
              label="Posición de desempeño"
              name="POSICION_EMPRESA"
            >
              <CustomInput readOnly={view} />
            </CustomFormItem>
          </Col>
        )}
        <Col xs={24} md={10}>
          <CustomFormItem required label="Moneda ingreso" name="MONEDA_INGRESO">
            <CustomRadioGroup
              block
              optionType="button"
              buttonStyle="solid"
              onChange={(value) => setCoinIngres(value.target.value)}
              disabled={view}
              options={[
                { label: Moneda.Peso, value: Moneda.Peso },
                { label: Moneda.Dolar, value: Moneda.Dolar },
                { label: Moneda.Euro, value: Moneda.Euro },
              ]}
            />
          </CustomFormItem>
          <CustomFormItem required label="Ingresos" name="INGRESO_PROMEDIO">
            <CustomInputNumber
              readOnly={view}
              disabled={!coinIngres}
              addonBefore={`${coinIngres} $`}
            />
          </CustomFormItem>
          {!tipoClientEmpresa && (
            <>
              <CustomFormItem label="Otros Ingresos" name="OTRO_INGRESO">
                <CustomInputNumber
                  readOnly={view}
                  disabled={!coinIngres}
                  addonBefore={`${coinIngres} $`}
                />
              </CustomFormItem>
              <CustomFormItem
                label="Detalles de Otros Ingresos"
                name="RAZON_OTRO_INGRESO"
              >
                <CustomInput.TextArea readOnly={view} disabled={!coinIngres} />
              </CustomFormItem>
            </>
          )}
        </Col>
      </Row>
    </>
  )
}

export default GeneralEntityForm
