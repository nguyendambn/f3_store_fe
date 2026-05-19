function Permission({role, value, name, title}) {
    return (
        <>
            <tr style={{ "pointerEvents": "none" }}>
                <td colSpan={role.length + 1} style={{ "background": "#F0F3FA" }}>
                    <strong>{title}</strong>
                </td>
            </tr>
            {value.map((item, index) => (
                <tr data-name={item}>
                    <td>{name[index]}</td>
                    {role.map(item => (
                        <td className="text-center" key={item._id}>
                            <input type="checkbox" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

export default Permission;