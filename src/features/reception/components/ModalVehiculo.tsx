import React, { useEffect } from 'react'
import { Modal, Form, Row, Col, Input, Select, InputNumber, Divider, Spin } from 'antd'
import { useReception } from '../hooks/useReception'
import type { DetalleRecepcionInput } from '../dto-receptionDto'

interface ModalVehiculoProps {
  visible: boolean
  onCancel: () => void
  onSave: (values: DetalleRecepcionInput) => void
  initialValues?: DetalleRecepcionInput
}

const ModalVehiculo: React.FC<ModalVehiculoProps> = ({
  visible,
  onCancel,
  onSave,
  initialValues,
}) => {
  const [form] = Form.useForm()
  const { 
    getMarcas, marcas, 
    getModelos, modelos, 
    getEstilos, estilos, 
    getColores, colores,
    isPendingMarcas, isPendingModelos, isPendingEstilos, isPendingColores
  } = useReception()

  const idMarcas = Form.useWatch('id_marca', form)
  const idModelos = Form.useWatch('id_modelo', form)

  useEffect(() => {
    if (visible) {
      getMarcas()
      getColores()
    }
  }, [visible, getMarcas, getColores])

  useEffect(() => {
    if (idMarcas) {
      getModelos(idMarcas)
    }
  }, [idMarcas, getModelos])

  useEffect(() => {
    if (idModelos) {
      getEstilos(idModelos)
    }
  }, [idModelos, getEstilos])

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues)
    } else if (visible) {
      form.resetFields()
      form.setFieldsValue({ condicion: 'NUEVO', otros_costos: 0, anio: new Date().getFullYear() })
    }
  }, [visible, initialValues, form])

  const handleMarcaChange = () => {
    form.setFieldsValue({ id_modelo: undefined, id_estilo: undefined })
  }

  const handleModeloChange = () => {
    form.setFieldsValue({ id_estilo: undefined })
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      
      // Enriquecer con nombres para la UI
      const enrichedValues = {
        ...values,
        marca_nombre: marcas.find((m: any) => m.id === values.id_marca)?.nombre,
        modelo_nombre: modelos.find((m: any) => m.id === values.id_modelo)?.nombre,
        estilo_nombre: estilos.find((e: any) => e.id === values.id_estilo)?.nombre,
        color_nombre: colores.find((c: any) => c.id === values.id_color)?.nombre,
      }
      
      onSave(enrichedValues)
      form.resetFields()
    } catch (error) {
      console.error('Validate Failed:', error)
    }
  }

  return (
    <Modal
      title={initialValues ? "Editar Motocicleta" : "Registrar Motocicleta"}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={800}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Divider orientation="left">Datos del Vehículo</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="chasis" label="Chasis" rules={[{ required: true }]}>
              <Input placeholder="Número de Chasis" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="condicion" label="Condición" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="NUEVO">Nuevo</Select.Option>
                <Select.Option value="USADO">Usado</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="numero_maquina" label="Número de Máquina">
              <Input placeholder="Placa o Motor" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="placa" label="Placa">
              <Input placeholder="Opcional" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="id_marca" label="Marca" rules={[{ required: true }]}>
              <Select
                placeholder={isPendingMarcas ? 'Cargando marcas...' : 'Seleccione marca'}
                onChange={handleMarcaChange}
                loading={isPendingMarcas}
                showSearch
                optionFilterProp="children"
                notFoundContent={isPendingMarcas ? <Spin size="small" /> : 'No hay marcas'}
              >
                {marcas.map((m: any) => (
                  <Select.Option key={m.id} value={m.id}>{m.nombre}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="id_modelo" label="Modelo" rules={[{ required: true }]}>
              <Select
                placeholder={isPendingModelos ? 'Cargando modelos...' : 'Seleccione modelo'}
                onChange={handleModeloChange}
                loading={isPendingModelos}
                showSearch
                optionFilterProp="children"
                disabled={!idMarcas}
                notFoundContent={isPendingModelos ? <Spin size="small" /> : 'No hay modelos'}
              >
                {modelos.map((m: any) => (
                  <Select.Option key={m.id} value={m.id}>{m.nombre}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="id_estilo" label="Estilo" rules={[{ required: true }]}>
              <Select
                placeholder={isPendingEstilos ? 'Cargando estilos...' : 'Seleccione estilo'}
                loading={isPendingEstilos}
                showSearch
                optionFilterProp="children"
                disabled={!idModelos}
                notFoundContent={isPendingEstilos ? <Spin size="small" /> : 'No hay estilos'}
              >
                {estilos.map((e: any) => (
                  <Select.Option key={e.id} value={e.id}>{e.nombre}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="id_color" label="Color" rules={[{ required: true }]}>
              <Select
                placeholder={isPendingColores ? 'Cargando colores...' : 'Seleccione color'}
                loading={isPendingColores}
                showSearch
                optionFilterProp="children"
                notFoundContent={isPendingColores ? <Spin size="small" /> : 'No hay colores'}
              >
                {colores.map((c: any) => (
                  <Select.Option key={c.id} value={c.id}>{c.nombre}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="anio" label="Año" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} placeholder="2024" min={1900} max={2100} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="cilindraje" label="Cilindraje" rules={[{ required: true, message: 'Ingrese el cilindraje' }]}>
              <InputNumber style={{ width: '100%' }} placeholder="125" min={1} />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Costos</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="costo_unitario" label="Costo de Compra" rules={[{ required: true }]}>
              <InputNumber 
                style={{ width: '100%' }} 
                prefix="$" 
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="precio_venta_estimado" label="Precio Venta Estimado" rules={[{ required: true }]}>
              <InputNumber 
                style={{ width: '100%' }} 
                prefix="$"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="otros_costos" label="Otros Costos">
              <InputNumber 
                style={{ width: '100%' }} 
                prefix="$"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalVehiculo
