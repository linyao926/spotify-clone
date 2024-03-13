import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ButtonPrimary.module.scss';

const cx = classNames.bind(styles);

function ButtonPrimary({
    to,
    href,
    icon = false,
    disabled = false,
    rounded = false,
    outline = false,
    active = false,
    underline,
    dark,
    block,
    primary,
    small,
    smaller,
    large,
    lefticon,
    rightIcon,
    children,
    className,
    onClick,
    ...passProps
}) {
    let Comp = 'button';
    const props = {
        onClick,
        ...passProps,
    };

    // Remove event listener when button disabled
    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }

    const classes = cx('wrapper', {
        [className]: className,
        icon,
        underline,
        dark,
        outline,
        block,
        active,
        primary,
        disabled,
        rounded,
        small,
        smaller,
        large,
    });

    return (
        <Comp className={classes} {...props}>
            {lefticon && <span className={cx('l-icon-inline')}>{lefticon}</span>}
            <span className={cx('title')}>{children}</span>
            {rightIcon && <span className={cx('r-icon-inline')}>{rightIcon}</span>}
        </Comp>
    );
}

export default ButtonPrimary;
